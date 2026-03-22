import Staff from "../models/Staff.js";

//Load staff with role history

export const getStaffWithCurrentRole =async (req)=>{
  try {
    const staff = await Staff.findById(req.user.id).populate("roles.role");
    if (!staff) return res.status(401).json({ message: "Unauthorized" });

    const currentRole = staff.getCurrentRole();
    if (!currentRole) {
      return res.status(403).json({ message: "No active role" });
    }

    req.staff = staff;
    req.currentRole = currentRole;
    next();
  } catch (err) {
    res.status(500).json({ message: "Authorization failed" });
  }
};


export const attachStaffRole = async (req, res, next) => {
  try {
    const staff = await Staff.findById(req.user.id).populate("roles.role");
    if (!staff) return res.status(401).json({ message: "Unauthorized" });

    const currentRole = staff.getCurrentRole();
    if (!currentRole) {
      return res.status(403).json({ message: "No active role" });
    }

    req.staff = staff;
    req.currentRole = currentRole;
    next();
  } catch (err) {
    res.status(500).json({ message: "Authorization failed" });
  }
};

 

//only admin can access

export const adminOnly = async ( req, res, next) => {
  if (req.currentRole.role.name !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
};

//Only first level admin has permission 

export const firstLvlAdmin =async(req, res,next)=>{
 if (!req.currentRole.role.permissions?.canCreateAdmin) {
    return res.status(403).json({ message: "First level admin only" });
  }
  next();
};

export const requireRole =(rolename) => {
  return async (req, res, next) => {
    const staff = req.staff;
    const currentRole =staff.getCurrentRole();

    if (!currentRole ||currentRole.role.name !==roleName){
      return res.status(403).json({message:"Access denied"});
    }next();
  };
};
