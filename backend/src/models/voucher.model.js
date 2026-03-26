import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const VoucherSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      default: "active",
      enum: ["active", "inactive"],
    },
    desc: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },

    voucherPrice: {
      type: Number,
      default: 0,
    },
    applicablePrice: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

VoucherSchema.plugin(mongoosePaginate);

const Voucher = mongoose.model("Voucher", VoucherSchema);

export default Voucher;
