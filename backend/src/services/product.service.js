import Brand from "../models/brand.model.js";
import Category from "../models/category.model.js";
import Product from "../models/product.model.js";

export const productService = {

  addProduct: async (body) => {
    return await Product.create(body);
  },

  getAllProduct: async (option, query) => {
    return await Product.paginate(query, option);
  },

  getProductById: async (id) => {
    return await Product.findById(id).populate([
      {
        path: "category",
        select: "_id nameCategory image desc",
      },
      {
        path: "brand",
        select: "_id nameBrand image desc",
      },
    ]);
  },

  updateStatus: async (productId, status) => {
    return await Product.findByIdAndUpdate(
      { _id: productId },
      { status },
      { new: true },
    );
  },

  updateDeleted: async (productId, is_deleted) => {
    return await Product.findByIdAndUpdate(
      { _id: productId },
      { is_deleted },
      { new: true },
    );
  },

  updateProduct: async (productId, body) => {
    return await Product.findByIdAndUpdate({ _id: productId }, body, {
      new: true,
    });
  },

  addProductToCategory: async (productId, categoryId) => {
    return await Category.findByIdAndUpdate(
      { _id: categoryId },
      { $addToSet: { products: productId } },
      { new: true },
    );
  },

  addProductToBrand: async (productId, brandId) => {
    return await Brand.findByIdAndUpdate(
      { _id: brandId },
      { $addToSet: { products: productId } },
      { new: true },
    );
  },

  removeProductFromCategory: async (productId, categoryId) => {
    return await Category.findByIdAndUpdate(
      { _id: categoryId },
      { $pull: { products: productId } },
      { new: true },
    );
  },

  removeProductFromBrand: async (productId, brandId) => {
    return await Brand.findByIdAndUpdate(
      { _id: brandId },
      { $pull: { products: productId } },
      { new: true },
    );
  },

  deleteProduct: async (productId) => {
    try {
      return await Product.findByIdAndDelete(productId);
    } catch (error) {
      console.error("Error deleting product:", error);
      throw new Error("Product deletion failed"); 
    }
  },

  updateQuantityProduct: async (productId, sizeId, quantity) => {
    return await Product.findOneAndUpdate(
      { _id: productId, "sizes._id": sizeId },
      { $set: { "sizes.$.quantity": quantity } }, 
      { new: true },
    );
  },
};
