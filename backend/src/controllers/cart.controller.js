import { HTTP_STATUS } from "../common/http-status.common.js";
import { TypeRole } from "../common/type.common.js";
import Cart from "../models/cart.model.js";
import User from "../models/user.model.js";
import { cartService } from "../services/cart.service.js";
import { productService } from "../services/product.service.js";

const checkUserExist = async (userId) => {
  const user = await User.findOne({ _id: userId });
  return user;
};

export const cartController = {

  addCart: async (req, res) => {
    const { _id } = req.user;
    const { userId: bodyUserId, ...product } = req.body;

    const userId = _id.toString();

    const userExist = await checkUserExist(userId);
    if (!userExist) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: "User not found",
        success: false,
      });
    }

    const productExist = await productService.getProductById(product.productId);
    if (!productExist) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Product not found",
        success: false,
      });
    }

    const result = await cartService.getCartsByUserId({
      userId,
    });
    if (!result) {

      const newCart = await cartService.createCart(userId, []);

      newCart.carts.push(product);

      const total =
        productExist.sale > 0
          ? product.quantity * (productExist.price - productExist.sale)
          : product.quantity * productExist.price;

      newCart.total = total;
      await newCart.save();

      return res.status(HTTP_STATUS.OK).json({
        message: "Thêm sản phẩm vào giỏ hàng thành công!",
        success: true,
      });
    }

    const { carts } = result;

    const productExitInCarts = carts.filter(
      (item) => item.productId.toString() === product.productId,
    );

    if (productExitInCarts && productExitInCarts.length > 0) {

      const itemExist = productExitInCarts.find(
        (item) => item.size === product.size && item.color === product.color,
      );
      if (itemExist) {
        itemExist.quantity += product.quantity;

        const total =
          productExist.sale > 0
            ? product.quantity * (productExist.price - productExist.sale)
            : product.quantity * productExist.price;
        result.total += total;
        await result.save();
        return res.status(HTTP_STATUS.OK).json({
          message: "Add to cart successfully",
          success: true,
        });
      } else {

        carts.push(product);

        const total =
          productExist.sale > 0
            ? product.quantity * (productExist.price - productExist.sale)
            : product.quantity * productExist.price;
        result.total += total;
        result.markModified("carts");
        await result.save();

        return res.status(HTTP_STATUS.OK).json({
          message: "Add to cart successfully",
          success: true,
        });
      }
    }

    else {

      carts.push(product);

      const total =
        productExist.sale > 0
          ? product.quantity * (productExist.price - productExist.sale)
          : product.quantity * productExist.price;

      result.total += total;
      result.markModified("carts");
      await result.save();

      return res.status(HTTP_STATUS.OK).json({
        message: "Add to cart successfully",
        success: true,
      });
    }
  },

  getCartByUserId: async (req, res) => {
    const { _id, role } = req.user;
    const params = req.query;
    const { statusUser } = params;

    let query = {};

    if (role !== TypeRole.ADMIN && Object.keys(params).length > 0) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        message: "You do not have permission to access",
        success: false,
      });
    }

    if (statusUser) {
      query = { status: statusUser };
    }

    query = { ...query, userId: _id };
    console.log("🚀 ~ getCartByUserId: ~ query:", query);

    const result = await cartService.getCartsByUserId(query, params);
    if (!result) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: "Cart not found",
        success: false,
      });
    }

    return res.status(HTTP_STATUS.OK).json({
      message: "Get cart successfully",
      success: true,
      data: result,
    });
  },

  getAllCarts: async (req, res) => {
    const { role } = req.user;
    const params = req.query;
    const { statusUser, _limit = 10, _page = 1, q } = params;

    const option = {
      page: parseInt(_page, 10),
      limit: parseInt(_limit, 10),
      populate: [
        {
          path: "userId",
          select: "_id email avatar fullname phone status",
        },
        {
          path: "carts.productId",
          select: "_id nameProduct price sale images is_deleted status",
        },
      ],
    };

    let query = {};

    if (role !== TypeRole.ADMIN && Object.keys(params).length > 0) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        message: "You do not have permission to access",
        success: false,
      });
    }

    if (q) {
      query = {
        ...query,

      };
    }

    const result = await Cart.paginate(query, option);
    if (!result) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: "Cart not found",
        success: false,
      });
    }

    return res.status(HTTP_STATUS.OK).json({
      message: "Get all carts successfully",
      success: true,
      ...result,
    });
  },

  updateQuantityProductInCart: async (req, res) => {
    const { _id } = req.user;
    const { productId, productIdInCart } = req.body;
    const { status } = req.query;

    const userId = _id.toString();

    const userExist = await checkUserExist(userId);
    if (!userExist) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: "User not found",
        success: false,
      });
    }

    const productExist = await productService.getProductById(productId);
    if (!productExist) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Product not found",
        success: false,
      });
    }

    const result = await cartService.getCartsByUserId({
      userId,
    });
    if (!result) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: "Cart not found",
        success: false,
      });
    }
    const { carts } = result;

    const productInCart = carts.find(
      (item) => item._id.toString() === productIdInCart,
    );
    if (!productInCart) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Product in cart not found",
        success: false,
      });
    }

    let isMaxQuantity = false;
    if (!status || status === "increase") {

      carts.forEach((item) => {
        if (item._id.toString() === productIdInCart) {
          item.quantity += 1;

          const sizeExist = productExist.sizes.find(
            (size) => size.size === item.size && size.color === item.color,
          );
          if (sizeExist && sizeExist.quantity < item.quantity) {

            item.quantity -= 1;
            isMaxQuantity = true;
          }
          if (!isMaxQuantity) {

            result.total =
              productExist.sale > 0
                ? productExist.price - productExist.sale + result.total
                : productExist.price + result.total;
          }
        }
      });

      if (isMaxQuantity) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          message: "Số lượng sản phẩm tồn kho không đủ để đặt hàng",
          success: false,
        });
      }

      await result.save();

      return res.status(HTTP_STATUS.OK).json({
        message: "Increase quantity product in cart successfully",

        success: true,
      });
    } else {

      carts.forEach((item) => {
        if (item._id.toString() === productIdInCart) {
          item.quantity -= 1;

          if (item.quantity < 1) {

            result.carts = carts.filter(
              (item) => item._id.toString() !== productIdInCart,
            );
          }

          result.total =
            productExist.sale > 0
              ? result.total - (productExist.price - productExist.sale)
              : result.total - productExist.price;

          if (result.total < 0) {
            result.total = 0;
          }
        }
      });

      await result.save();

      return res.status(HTTP_STATUS.OK).json({
        message: "Decrease quantity product in cart successfully",
        success: true,
      });
    }
  },

  deleteProductInCart: async (req, res) => {
    const { _id } = req.user;

    const { productIdsInCart } = req.body;

    const userId = _id.toString();

    const result = await cartService.getCartsByUserId({
      userId,
    });
    if (!result) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: "Cart not found",
        success: false,
      });
    }
    const { carts } = result;

    if (
      !productIdsInCart ||
      !Array.isArray(productIdsInCart) ||
      productIdsInCart.length === 0
    ) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Invalid productIdsInCart array",
        success: false,
      });
    }

    let deductAmount = 0;

    for (const itemId of productIdsInCart) {
      const productInCart = carts.find(
        (item) => item._id.toString() === itemId,
      );
      if (productInCart) {

        const productExist = await productService.getProductById(
          productInCart.productId,
        );
        if (productExist) {
          const itemTotal =
            productExist.sale > 0
              ? (productExist.price - productExist.sale) *
                productInCart.quantity
              : productExist.price * productInCart.quantity;
          deductAmount += itemTotal;
        }
      }
    }

    result.carts = carts.filter(
      (item) => !productIdsInCart.includes(item._id.toString()),
    );

    result.total -= deductAmount;
    if (result.total < 0) {
      result.total = 0;
    }

    result.markModified("carts");
    await result.save();

    return res.status(HTTP_STATUS.OK).json({
      message: "Delete product in cart successfully",
      success: true,
    });
  },
};
