import dayjs from "dayjs";
import { HTTP_STATUS } from "../common/http-status.common.js";
import { orderService } from "../services/order.service.js";
import { productService } from "../services/product.service.js";
import { voucherService } from "../services/voucher.service.js";
import { generateVnPayUrl } from "./payment.controller.js";

export const orderController = {
  optionOrder: (params) => {
    const { _limit = 10, _page = 1, q, populate, ...rest } = params;

    let populateDefault = [
      { path: "products.productId", select: "_id nameProduct desc images" },
      { path: "userId", select: "_id email" },
      { path: "assignee", select: "_id fullname role" },
    ];
    if (populate) {
      if (Array.isArray(populate)) {
        populateDefault = [...populateDefault, ...populate];
      } else {
        populateDefault.push(populate);
      }
    }
    let query = {};

    if (rest.status) {
      query = {
        ...query,
        status: rest.status,
      };
    }

    const option = {
      limit: parseInt(_limit),
      page: parseInt(_page),
      populate: populateDefault,
    };
    return { option, query };
  },
  // create order
  createOrder: async (req, res) => {
    try {
      const { _id: userId } = req.user;
      const {
        products: requestedProducts,
        voucher: voucherId,
        infoOrderShipping,
        paymentMethod,
        note,
      } = req.body;

      // 1. TÍNH TOÁN GIÁ VÀ KIỂM TRA TỒN KHO TẠI SERVER
      let subTotal = 0;
      const verifiedProducts = [];
      const stockUpdates = [];

      for (const item of requestedProducts) {
        const { productId, quantity, size, color } = item;

        const dbProduct = await productService.getProductById(productId);
        if (!dbProduct) {
          return res.status(HTTP_STATUS.NOT_FOUND).json({
            message: `Sản phẩm ${productId} không tồn tại!`,
            success: false,
          });
        }

        const variant = dbProduct.sizes.find(
          (s) => s.size === size && s.color === color,
        );

        if (!variant) {
          return res.status(HTTP_STATUS.BAD_REQUEST).json({
            message: `Sản phẩm ${dbProduct.nameProduct} không có variant ${size}-${color}!`,
            success: false,
          });
        }

        if (variant.quantity < quantity) {
          return res.status(HTTP_STATUS.BAD_REQUEST).json({
            message: `Sản phẩm ${dbProduct.nameProduct} không đủ hàng!`,
            success: false,
          });
        }

        // Lấy giá từ DB
        const itemPrice = dbProduct.price;
        subTotal += itemPrice * quantity;

        verifiedProducts.push({
          productId: dbProduct._id,
          name: dbProduct.nameProduct,
          price: itemPrice,
          quantity,
          size,
          color,
          image: dbProduct.images?.[0]?.url || "",
        });

        stockUpdates.push({
          productId: dbProduct._id,
          variantId: variant._id,
          newQuantity: variant.quantity - quantity,
        });
      }

      // 2. TÍNH VOUCHER
      let voucherDiscount = 0;
      if (voucherId) {
        const voucherDoc = await voucherService.findVoucherById(voucherId);
        if (
          voucherDoc &&
          dayjs().isBefore(dayjs(voucherDoc.endDate)) &&
          voucherDoc.discount > 0
        ) {
          voucherDiscount = voucherDoc.voucherPrice;
          // Cập nhật lượt dùng voucher
          await voucherService.updateVoucher(voucherId, {
            discount: voucherDoc.discount - 1,
          });
        }
      }

      const shippingPrice = 0; // Có thể hardcode hoặc lấy từ logic ship
      const finalTotal = Math.max(
        0,
        subTotal + shippingPrice - voucherDiscount,
      );

      // 3. TẠO ORDER (Pending status)
      const newOrder = await orderService.createOrder({
        userId,
        products: verifiedProducts,
        total: finalTotal,
        subTotal,
        priceShipping: shippingPrice,
        voucher: voucherId || null,
        infoOrderShipping,
        paymentMethod,
        note,
        status: "pending",
      });

      // 4. XỬ LÝ THANH TOÁN VNPAY NẾU CẦN
      let paymentUrl = null;
      if (paymentMethod === "vnpay") {
        paymentUrl = generateVnPayUrl(req, newOrder._id.toString(), finalTotal);
      }

      // 5. CẬP NHẬT KHO
      await Promise.all(
        stockUpdates.map((u) =>
          productService.updateQuantityProduct(
            u.productId,
            u.variantId,
            u.newQuantity,
          ),
        ),
      );

      return res.status(HTTP_STATUS.CREATED).json({
        message: "Đặt hàng thành công!",
        success: true,
        data: newOrder,
        paymentUrl,
      });
    } catch (error) {
      console.error("Order Creation Error:", error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: "Lỗi hệ thống khi tạo đơn hàng.",
        success: false,
      });
    }
  },
  getOrdersByUserId: async (req, res) => {
    const { _id } = req.user;

    const orders = await orderService.getOrdersByUserId(_id);

    if (!orders) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: "Không tìm thấy đơn hàng!", success: false });
    }

    return res.status(HTTP_STATUS.OK).json({
      message: "Lấy danh sách đơn hàng thành công!",
      success: true,
      data: orders,
    });
  },

  // get all orders
  getAllOrders: async (req, res) => {
    const { _limit = 10, _page = 1, q, status } = req.query;
    const { option, query } = orderController.optionOrder({
      _limit,
      _page,
      q,
      status,
    });

    const orders = await orderService.getAllOrders(query, option);

    if (!orders) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: "Không tìm thấy đơn hàng!", success: false });
    }

    return res.status(HTTP_STATUS.OK).json({
      message: "Lấy danh sách đơn hàng thành công!",
      success: true,
      ...orders,
    });
  },

  // check status
  checkStatus: (previousStatus, currentStatus) => {
    switch (currentStatus) {
      case "confirmed":
        if (previousStatus === "pending") {
          return true;
        }
        return false;
      case "delivery":
        if (previousStatus === "confirmed") {
          return true;
        }
        return false;
      case "completed":
        if (previousStatus === "delivery") {
          return true;
        }
        return false;
      case "cancelled":
        if (previousStatus === "pending" || previousStatus === "confirmed") {
          return true;
        }
        return false;
      default:
        return false;
    }
  },

  // cập nhật đơn hàng trạng thái đơn hàng
  updateOrder: async (req, res) => {
    const { _id } = req.user;
    const userRole = req.user?.role;
    console.log("🚀 ~ updateOrder: ~ req.user:", req.user);
    const { orderId } = req.params;
    const { status, message } = req.body;

    // lấy ra thông tin đơn hàng theo orderId
    const order = await orderService.getOrderById(orderId);

    // Admin có thể cập nhật mọi đơn hàng mà không cần assignee
    const isAdmin = userRole === "admin";

    // check xem có trường assignee không
    if (!order.assignee && order.status === "pending") {
      // gán _id của user hiện tại vào trường assignee và cập nhật trạng thái đơn hàng => confirmed
      const updateData = isAdmin ? { status } : { assignee: _id, status };
      const updateOrder = await orderService.updateOrder(
        { _id: orderId },
        updateData,
      );
      if (!updateOrder) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: "Cập nhật đơn hàng thất bại!", success: false });
      }
      return res
        .status(HTTP_STATUS.OK)
        .json({ message: "Cập nhật đơn hàng thành công!", success: true });
    }

    // Admin được phép cập nhật mọi đơn hàng (bỏ qua kiểm tra assignee)
    if (!isAdmin) {
      // check xem có phải là người được gán đơn hàng không
      if (order.assignee && order.assignee._id.toString() !== _id) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          message: "Bạn không có quyền cập nhật đơn hàng này!",
          success: false,
        });
      }
    }

    // check xem trạng thái đơn hàng có hợp lệ không
    const checkStatusInvalid = orderController.checkStatus(
      order.status,
      status,
    );
    if (!checkStatusInvalid) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: "Trạng thái đơn hàng không hợp lệ!", success: false });
    }

    // trim() => tác dụng xoá các khoảng trắng ở đầu và cuối chuỗi
    // kiểm tra xem trạng thái đơn hàng có phải là cancelled không và message có giá trị không
    if (status === "cancelled" && (!message || message.trim() === "")) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: "Vui lòng nhập lý do hủy đơn hàng!", success: false });
    }

    if (status === "cancelled" && message.trim() !== "") {
      // cập nhật trạng thái đơn hàng và lý do hủy đơn hàng
      const updateOrder = await orderService.updateOrder(
        { _id: orderId },
        { status, reasonCancel: message },
      );
      if (!updateOrder) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: "Cập nhật đơn hàng thất bại!", success: false });
      }
      return res
        .status(HTTP_STATUS.OK)
        .json({ message: "Cập nhật đơn hàng thành công!", success: true });
    }

    // cập nhật trạng thái đơn hàng
    const updateOrder = await orderService.updateOrder(
      { _id: orderId },
      { status, reasonCancel: "" },
    );
    if (!updateOrder) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: "Cập nhật đơn hàng thất bại!", success: false });
    }
    return res
      .status(HTTP_STATUS.OK)
      .json({ message: "Cập nhật đơn hàng thành công!", success: true });
  },

  // cancel order
  cancelOrder: async (req, res) => {
    try {
      const { role } = req.user;
      const { orderId } = req.params;
      const { message, status } = req.body;

      // 1. Lấy thông tin đơn hàng
      const order = await orderService.getOrderById(orderId);
      if (!order) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          message: "Không tìm thấy đơn hàng!",
          success: false,
        });
      }

      // 2. Kiểm tra quyền hạn (Role check)
      if (role === "customer") {
        // Khách hàng chỉ được hủy đơn của chính mình
        if (order.userId._id.toString() !== req.user._id.toString()) {
          return res.status(HTTP_STATUS.FORBIDDEN).json({
            message: "Bạn không có quyền hủy đơn hàng này!",
            success: false,
          });
        }

        // Khách hàng chỉ được hủy đơn ở trạng thái 'pending' (chờ xác nhận)
        if (order.status !== "pending") {
          return res.status(HTTP_STATUS.BAD_REQUEST).json({
            message: "Đơn hàng đã được xử lý, không thể hủy!",
            success: false,
          });
        }
      }

      // 3. Kiểm tra dữ liệu đầu vào
      if (status !== "cancelled" || !message || message.trim() === "") {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          message: "Vui lòng cung cấp trạng thái 'cancelled' và lý do hủy đơn!",
          success: false,
        });
      }

      // 4. Cập nhật trạng thái đơn hàng
      const updateOrder = await orderService.updateOrder(
        { _id: orderId },
        { status: "cancelled", reasonCancel: message },
      );

      if (!updateOrder) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          message: "Hủy đơn hàng thất bại!",
          success: false,
        });
      }

      // 5. Cập nhật lại số lượng sản phẩm trong kho (Sử dụng for...of thay cho forEach để await đúng)
      // Chúng ta cần hoàn trả số lượng sản phẩm về kho
      for (const item of order.products) {
        try {
          const productInfo = await productService.getProductById(
            item.productId,
          );
          if (productInfo) {
            const productSize = productInfo.sizes.find(
              (s) => s.size === item.size && s.color === item.color,
            );
            if (productSize) {
              const newQuantity = productSize.quantity + item.quantity;
              await productService.updateQuantityProduct(
                item.productId,
                productSize._id,
                newQuantity,
              );
            }
          }
        } catch (error) {
          console.error(
            `Lỗi trả hàng về kho cho sản phẩm ${item.productId}:`,
            error,
          );
          // Không return res ở đây để tránh gián đoạn các sản phẩm khác,
          // nhưng lỗi này nên được log lại để kiểm tra thủ công nế cần.
        }
      }

      return res.status(HTTP_STATUS.OK).json({
        message: "Hủy đơn hàng thành công!",
        success: true,
      });
    } catch (error) {
      console.error("Lỗi trong cancelOrder controller:", error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: "Có lỗi xảy ra khi xử lý yêu cầu!",
        success: false,
      });
    }
  },
};
