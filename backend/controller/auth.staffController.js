import Staff from "../models/Staff.js";
import generateToken from "../utils/generateToken.js";

// export const staffLogin = async (req, res) => {
//   const { email, password } = req.body;

//   const staff = await Staff.findOne({ email })
//     .populate("roles.role");

//   if (!staff || !(await staff.matchPassword(password))) {
//     return res.status(401).json({ message: "Invalid credentials" });
//   }

//   const currentRole = staff.getCurrentRole();

//   if (!currentRole) {
//     return res.status(401).json({ message: "No active role assigned" });
//   }

//   res.status(200).json({
//     token: generateToken(staff._id),
//     staff: {
//       id: staff._id,
//       name: staff.name,
//       role: currentRole.role.name,
//       permissions: currentRole.role.permissions
//     }
//   });
// };
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