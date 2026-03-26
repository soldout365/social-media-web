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

    if (rest.status) {
      query = {
        ...query,
        status: rest.status,
      };
    }

    if (rest.deleted) {
      query = {
        ...query,
        is_deleted: rest.deleted === "true" ? true : false,
      };
    }

    if (rest.category) {
      query = {
        ...query,
        category: rest.category,
      };
    }

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

  checkIdProductInvalid: async (req, res) => {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: "Id product invalid", success: false });
    }
    return true;
  },

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

      const product = await productService.addProduct(body);
      if (!product) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: "Add product failed", success: false });
      }

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

  updateStatus: async (req, res) => {
    try {
      const { productId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: "Invalid product ID", success: false });
      }

      const productExist = await productService.getProductById(productId);
      if (!productExist) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: "Product not found", success: false });
      }

      const newStatus =
        productExist.status === "active" ? "inactive" : "active";

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

  updateProduct: async (req, res) => {
    try {
      const { productId } = req.params;
      const body = req.body;

      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: "Id product invalid", success: false });
      }

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

      const productExist = await productService.getProductById(productId);
      if (!productExist) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: "Product not found", success: false });
      }

      await productController.removeProductFromCateAndBrand(
        productId,
        productExist.category ? productExist.category._id : null,
        productExist.brand ? productExist.brand._id : null,
      );

      const product = await productService.updateProduct(productId, body);
      if (!product) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: "Update product failed", success: false });
      }

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

  deleteProduct: async (req, res) => {
    try {
      const { productId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: "Invalid product ID", success: false });
      }

      const productExist = await productService.getProductById(productId);
      if (!productExist) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: "Product not found", success: false });
      }

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

  deleteMultiple: async (req, res) => {
    const { id: ids } = req.query;

    if (!ids || !ids.length) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: "Ids invalid", success: false });
    }

    const idsArray = Array.isArray(ids) ? ids : [ids];

    const checkIds = idsArray.map((id) => {
      return mongoose.Types.ObjectId.isValid(id);
    });

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

      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: "Invalid product ID", success: false });
      }

      const product = await productService.getProductById(productId);
      if (!product) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: "Product not found", success: false });
      }

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
