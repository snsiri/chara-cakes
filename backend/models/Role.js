import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ["baker", "manager", "admin",'delivary staff','firstlevelAdmin'],
    required: true,
    unique: true
  },

  salary: {
    basicMonthly: Number,
    hourlyOT: Number,
    allowances: Number
  },

  permissions: {
    canCreateAdmin: { type: Boolean, default: false },
    canManageStaff: { type: Boolean, default: false },
    canManageOrders: { type: Boolean, default: false }
  }
});

export default mongoose.model("Role", roleSchema);
