import mongoose from "mongoose";
import { HTTP_STATUS } from "../common/http-status.common.js";
import Product from "../models/product.model.js";
import { productService } from "../services/product.service.js";
import { getCategoryByIdService } from "../services/category.service.js";
import { getBrandByIdService } from "../services/brand.service.js";

export const productController = {
  optionProduct: (params) => {
    const { _limit = 10, _page = 1, q, populate, rest } = params;

    let populateDefault = [
      {
        path: "category",
        select: "_id nameCategory image desc",
      },
      {
        path: "brand",
        select: "_id nameBrand image desc",
      },
    ];
    if (populate) {
      if (Array.isArray(populate)) {
        populateDefault = [...populateDefault, ...populate];
      } else {
        populateDefault.push(populate);
      }
    }
    let query = {};
    if (q) {
      query = {
        $and: [
          {
            $or: [{ nameProduct: { $regex: new RegExp(q), $options: "i" } }],
          },
        ],
      };
    }
    // filter status
    if (rest.status) {
      query = {
        ...query,
        status: rest.status,
      };
    }
    // filter deleted
    if (rest.deleted) {
      query = {
        ...query,
        is_deleted: rest.deleted === "true" ? true : false,
      };
    }
    // filter category
    if (rest.category) {
      query = {
        ...query,
        category: rest.category,
      };
    }
    // filter brand
    if (rest.brand) {
      query = {
        ...query,
        brand: rest.brand,
      };
    }

    const option = {
      limit: parseInt(_limit),
      page: parseInt(_page),
      populate: populateDefault,
      sort: { createdAt: -1 },
    };
    return { option, query };
  },
  // check id product invalid
  checkIdProductInvalid: async (req, res) => {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: "Id product invalid", success: false });
    }
    return true;
  },
  // check product exist
  checkProductExist: async (req, res) => {
    const { productId } = req.params;

    const productExist = await productService.getProductById(productId);
    if (!productExist) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: "Product not found", success: false });
    }
    return productExist;
  },
  // xoá product_id trong category và brand cũ
  removeProductFromCateAndBrand: async (productId, categoryId, brandId) => {
    const promises = [];
    if (categoryId) {
      promises.push(
        productService.removeProductFromCategory(productId, categoryId),
      );
    }
    if (brandId) {
      promises.push(productService.removeProductFromBrand(productId, brandId));
    }
    await Promise.all(promises);
    return true;
  },

  // add product
  addProduct: async (req, res) => {
    try {
      const body = req.body;

      if (!body.category || !mongoose.Types.ObjectId.isValid(body.category)) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: "Invalid or missing category ID", success: false });
      }
      if (!body.brand || !mongoose.Types.ObjectId.isValid(body.brand)) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: "Invalid or missing brand ID", success: false });
      }

      // Check if category and brand actually exist in DB
      const [categoryExists, brandExists] = await Promise.all([
        getCategoryByIdService(body.category),
        getBrandByIdService(body.brand),
      ]);

      if (!categoryExists) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          message: `Category with ID ${body.category} not found`,
          success: false,
        });
      }
      if (!brandExists) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          message: `Brand with ID ${body.brand} not found`,
          success: false,
        });
      }

      // add product
      const product = await productService.addProduct(body);
      if (!product) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: "Add product failed", success: false });
      }

      // add productId vào product của category và brand tương ứng
      await Promise.all([
        productService.addProductToCategory(product._id, product.category),
        productService.addProductToBrand(product._id, product.brand),
      ]);

      return res.status(HTTP_STATUS.OK).json({
        message: "Add product successfully",
        success: true,
        data: product,
      });
    } catch (error) {
      console.error("Error in addProduct:", error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: error.message || "Server error during add product",
        success: false,
      });
    }
  },
  // get all product
  getAllProduct: async (req, res) => {
    const { _limit = 8, _page = 1, q, ...rest } = req.query;
    const { option, query } = productController.optionProduct({
      _limit,
      _page,
      q,
      rest,
    });

    const products = await productService.getAllProduct(option, query);
    if (!products) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: "Get all products failed", success: false });
    }
    return res.status(HTTP_STATUS.OK).json({
      message: "Get all product successfully",
      success: true,
      ...products,
    });
  },
  // get product by id
  getProductById: async (req, res) => {
    const { id } = req.params;

    const product = await productService.getProductById(id);
    if (!product) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: "Get product failed", success: false });
    }

    return res.status(HTTP_STATUS.OK).json({
      message: "Get product successfully",
      success: true,
      data: product,
    });
  },
  // get product with status
  getProductWithStatus: async (req, res) => {
    const { status, deleted } = req.params;
    const { _limit = 10, _page = 1, q } = req.query;
    const { option, query } = productController.optionProduct({
      _limit,
      _page,
      q,
      rest: {
        status,
        deleted,
      },
    });

    const products = await productService.getAllProduct(option, query);
    if (!products) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: "Get all products failed", success: false });
    }
    return res.status(HTTP_STATUS.OK).json({
      message: "Get all product successfully",
      success: true,
      ...products,
    });
  },
  // update status
  updateStatus: async (req, res) => {
    try {
      const { productId } = req.params;

      // 1. Kiểm tra productId hợp lệ
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: "Invalid product ID", success: false });
      }

      // 2. Lấy thông tin product từ DB
      const productExist = await productService.getProductById(productId);
      if (!productExist) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: "Product not found", success: false });
      }

      // 3. Tự động đảo ngược status (Toggle)
      const newStatus =
        productExist.status === "active" ? "inactive" : "active";

      // 4. Update status mới
      const updatedProduct = await productService.updateStatus(
        productId,
        newStatus,
      );
      if (!updatedProduct) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: "Update status failed", success: false });
      }

      return res.status(HTTP_STATUS.OK).json({
        message: `Product status updated to ${newStatus}`,
        success: true,
        data: updatedProduct,
      });
    } catch (error) {
      console.error("Error in updateStatus:", error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: "Server error during update status",
        success: false,
      });
    }
  },
  // update product
  updateProduct: async (req, res) => {
    try {
      const { productId } = req.params;
      const body = req.body;

      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: "Id product invalid", success: false });
      }

      // If updating category or brand, validate them first
      if (body.category) {
        if (!mongoose.Types.ObjectId.isValid(body.category)) {
          return res
            .status(HTTP_STATUS.BAD_REQUEST)
            .json({ message: "Invalid category ID format", success: false });
        }
        const categoryExists = await getCategoryByIdService(body.category);
        if (!categoryExists) {
          return res.status(HTTP_STATUS.BAD_REQUEST).json({
            message: `Category with ID ${body.category} not found`,
            success: false,
          });
        }
      }

      if (body.brand) {
        if (!mongoose.Types.ObjectId.isValid(body.brand)) {
          return res
            .status(HTTP_STATUS.BAD_REQUEST)
            .json({ message: "Invalid brand ID format", success: false });
        }
        const brandExists = await getBrandByIdService(body.brand);
        if (!brandExists) {
          return res.status(HTTP_STATUS.BAD_REQUEST).json({
            message: `Brand with ID ${body.brand} not found`,
            success: false,
          });
        }
      }

      // check product exist
      const productExist = await productService.getProductById(productId);
      if (!productExist) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: "Product not found", success: false });
      }

      // xoas product_id trong category và brand cũ
      await productController.removeProductFromCateAndBrand(
        productId,
        productExist.category ? productExist.category._id : null,
        productExist.brand ? productExist.brand._id : null,
      );

      // update product
      const product = await productService.updateProduct(productId, body);
      if (!product) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: "Update product failed", success: false });
      }

      // add productId vào product của category và brand tương ứng
      await Promise.all([
        productService.addProductToCategory(product._id, product.category),
        productService.addProductToBrand(product._id, product.brand),
      ]);

      return res.status(HTTP_STATUS.OK).json({
        message: "Update product successfully",
        success: true,
        data: product,
      });
    } catch (error) {
      console.error("Error in updateProduct:", error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: error.message || "Server error during update product",
        success: false,
      });
    }
  },
  // xoa cung
  deleteProduct: async (req, res) => {
    try {
      const { productId } = req.params;

      // 1. Validate `productId`
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: "Invalid product ID", success: false });
      }

      // 2. Check if the product exists
      const productExist = await productService.getProductById(productId);
      if (!productExist) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: "Product not found", success: false });
      }

      // 3. Ensure the product can be deleted (e.g., must be marked as deleted or inactive)
      if (
        !productExist.is_deleted ||
        !["active", "inactive"].includes(productExist.status)
      ) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          message:
            "Product cannot be permanently deleted. Verify the status and is_deleted flag.",
          success: false,
        });
      }

      // 4. Remove references from category and brand (if applicable)
      if (productExist.category) {
        await productService.removeProductFromCategory(
          productId,
          productExist.category._id,
        );
      }
      if (productExist.brand) {
        await productService.removeProductFromBrand(
          productId,
          productExist.brand._id,
        );
      }

      // 5. Perform the deletion
      const productDeleteResult = await productService.deleteProduct(productId);
      if (!productDeleteResult) {
        return res
          .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
          .json({ message: "Failed to delete product", success: false });
      }

      return res
        .status(HTTP_STATUS.OK)
        .json({ message: "Product deleted successfully", success: true });
    } catch (error) {
      console.error("Error in deleteProduct:", error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: "Server error during deletion", success: false });
    }
  },

  // hard delete mutiple
  deleteMultiple: async (req, res) => {
    const { id: ids } = req.query;

    if (!ids || !ids.length) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: "Ids invalid", success: false });
    }

    // Đảm bảo ids luôn là 1 mảng (đề phòng Postman chỉ gởi 1 id lên)
    const idsArray = Array.isArray(ids) ? ids : [ids];

    // check id product invalid
    const checkIds = idsArray.map((id) => {
      return mongoose.Types.ObjectId.isValid(id);
    });

    // include
    if (checkIds.includes(false)) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: "Ids invalid", success: false });
    }

    const result = await Product.deleteMany({ _id: { $in: idsArray } });
    if (!result) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Delete multiple failed",
        success: false,
        status: HTTP_STATUS.BAD_REQUEST,
      });
    }

    return res.status(HTTP_STATUS.OK).json({
      message: "Delete multiple successfully",
      success: true,
      status: HTTP_STATUS.OK,
    });
  },

  softDeleteProduct: async (req, res) => {
    try {
      const { productId } = req.params;

      // Check if productId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: "Invalid product ID", success: false });
      }

      // Fetch the product by ID
      const product = await productService.getProductById(productId);
      if (!product) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: "Product not found", success: false });
      }

      // Determine if the product can be soft-deleted or restored
      const newIsDeletedStatus = !product.is_deleted;
      const updatedProduct = await productService.updateDeleted(
        productId,
        newIsDeletedStatus,
      );

      if (!updatedProduct) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          message: "Failed to update product deletion status",
          success: false,
        });
      }

      return res.status(HTTP_STATUS.OK).json({
        message: newIsDeletedStatus
          ? "Product soft-deleted successfully"
          : "Product restored successfully",
        success: true,
        data: updatedProduct,
      });
    } catch (error) {
      console.error("Error in softDeleteProduct:", error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: "Server error during soft delete", success: false });
    }
  },
};
