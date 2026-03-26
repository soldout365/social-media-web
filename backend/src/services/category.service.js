import Category from "../models/category.model.js";

export const createCategoryService = async (body) => {
  const newBrand = await Category.create(body);

  return newBrand;
};

export const getAllCategories = async (q) => {
  const query = {
    nameCategory: { $regex: q || "", $options: "i" },
  };

  const categories = await Category.find(query).sort({ createdAt: -1 });

  return categories;
};

export const getCategoryByIdService = async (id) => {
  const category = await Category.findById({ _id: id });

  return category;
};

export const updateCategoryService = async (id, body) => {
  const category = await Category.findByIdAndUpdate({ _id: id }, body, {
    new: true,
  });
  return category;
};

export const deleteCategoryService = async (id) => {
  const category = await Category.findByIdAndDelete({ _id: id });
  return category;
};
