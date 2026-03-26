import Voucher from "../models/voucher.model.js";

export const voucherService = {

  createVoucher: async (body) => {
    return await Voucher.create(body);
  },

  updateVoucher: async (id, body) => {
    return await Voucher.findByIdAndUpdate({ _id: id }, body, { new: true });
  },

  findVoucherById: async (id) => {
    return await Voucher.findById(id);
  },

  getVouchers: async (query) => {
    return await Voucher.find(query);
  },
};
