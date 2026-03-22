import Staff from "../models/Staff.js";

export const changeRole = async (staff, roleId) => {
  const current = staff.getCurrentRole();
  if (current) current.to = new Date();

  staff.roles.push({
    role: roleId,
    from: new Date(),
    to: null
  });

  staff.last_updated_At = new Date();
  await staff.save();
};