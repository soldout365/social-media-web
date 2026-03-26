import Order from "../models/order.model.js";

export const orderService = {

  createOrder: async (body) => {
    return await Order.create(body);
  },

  getOrdersByUserId: async (userId) => {
    return await Order.find({ userId }).populate([
      {
        path: "products.productId",
        select: "_id nameProduct desc images category brand",
      },
      { path: "userId", select: "_id email" },
      { path: "assignee" },
    ]);
  },

  getAllOrders: async (query, option) => {
    return await Order.paginate(query, option);
  },

  getOrderById: async (orderId) => {
    return await Order.findById(orderId).populate([
      { path: "products.productId", select: "_id nameProduct desc images" },
      { path: "userId", select: "_id email" },
      { path: "assignee", select: "_id email avatar role status" },
    ]);
  },

  updateOrder: async (_id, body) => {
    return await Order.findByIdAndUpdate(_id, body, { new: true });
  },
};
