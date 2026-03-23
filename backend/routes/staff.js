import express from 'express';
import Staff from '../models/Staff.js';
import Role from '../models/Role.js'; 
import getNextSequenceValue from '../utils/sequence.js';
const prefix="STAFF-";
import multer from 'multer';
import path from 'path';
import { Protect } from '../middleware/authStaff.js';
import { adminOnly, firstLvlAdmin ,attachStaffRole} from "../middleware/authorization.js";
import { changeRole } from '../controller/roleController.js';
import mongoose from 'mongoose';

const router = express.Router();

//ADMIN-----

// Promote staff to admins and first level  admins 
router.post("/admin/promote/:id",Protect,attachStaffRole,firstLvlAdmin,async (req, res) => {
  const { roleId } = req.body;

  const staff = await Staff.findById(req.params.id).populate("roles.role");
  if (!staff) return res.status(404).json({ message: "Staff not found" });

  const current = staff.getCurrentRole();
  if (current?.role.name === "admin") {
    return res.status(400).json({ message: "Already admin" });
  }

  await changeRole(staff, roleId);
  res.json({ message: "Staff promoted to admin" });
});

// Demote admins
router.post("/admin/demote/:id",Protect,attachStaffRole,firstLvlAdmin,async (req, res) => {
  const { roleId } = req.body;

  const staff = await Staff.findById(req.params.id).populate("roles.role");
  if (!staff) return res.status(404).json({ message: "Staff not found" });

  const current = staff.getCurrentRole();
  if (current?.role.name !== "admin") {
    return res.status(400).json({ message: "Not an admin" });
  }
 await changeRole(staff, roleId);
  res.json({ message: "Admin demoted" });
});

//Add Admin directly
router.post("/admin",Protect,attachStaffRole,firstLvlAdmin,async (req, res) => {
    const { name, email, password, roleId } = req.body;

    const exists = await Staff.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Staff already exists" });
    }

    const newId = await getNextSequenceValue(prefix, "staffid");

    const admin = await Staff.create({
      _id: newId,
      name,
      email,
      password,
      roles: [
        {
          role: roleId, // admin roleId
          from: new Date(),
          to: null
        }
      ],
      CreatedOn: new Date(),
      last_updated_At: new Date()
    });

    res.status(201).json({
      message: "Admin created successfully",
      adminId: admin._id
    });
  }
);



//Delete Admin
router.delete("/admin/:id",Protect,attachStaffRole,firstLvlAdmin,async (req, res) => {
  const staff = await Staff.findById(req.params.id).populate("roles.role");
  if (!staff) return res.status(404).json({ message: "Staff not found" });

  const current = staff.getCurrentRole();
  if (current?.role.name !== "admin") {
    return res.status(400).json({ message: "Not an admin" });
  }

  await Staff.findByIdAndDelete(req.params.id);
  res.json({ message: "Admin deleted" });
});
//get all staff
router.get("/",Protect,attachStaffRole,adminOnly,async (req, res) => {
    try {
        const staff = await Staff.find();
        res.json(staff);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "Error fetching staff", error: err.message });
    }
});

//Change admin details

router.put("/admin/:id",Protect,attachStaffRole,firstLvlAdmin,async (req, res) => {
    const admin = await Staff.findById(req.params.id).populate("roles.role");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const currentRole = admin.getCurrentRole();
    if (currentRole?.role.name !== "admin") {
      return res.status(400).json({ message: "Not an admin" });
    }

    const { name, email, phone, address } = req.body;

    if (name) admin.name = name;
    if (email) admin.email = email;
    if (phone) admin.phone = phone;
    if (address) admin.address = address;

    admin.last_updated_At = new Date();
    await admin.save();

    res.json({ message: "Admin details updated successfully" });
  }
);




//STAFF-------

//Add non admin staff
router.post("/staff",Protect,attachStaffRole,adminOnly,async (req, res) => {
  const { id, name, email, password, roleId } = req.body;

  const exists = await Staff.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: "Staff already exists" });
  }
  const sequenceName = "staffid";
  const newId = await getNextSequenceValue(prefix, sequenceName);

  const staff = await Staff.create({
    _id: newId,
    name,
    email,
    password,
    roles: [{ role: roleId, from: new Date(), to: null }],
    CreatedOn: new Date(),
    last_updated_At: new Date()
  });

  res.status(201).json({ message: "Staff created", staffId: staff._id });
});

//Change non admin details
router.put("/staff/:id",Protect,attachStaffRole,adminOnly,async (req, res) => {
  const staff = await Staff.findById(req.params.id);
  if (!staff) return res.status(404).json({ message: "Staff not found" });

  const { name, email } = req.body;
  if (name) staff.name = name;
  if (email) staff.email = email;

  staff.last_updated_At = new Date();
  await staff.save();

  res.json({ message: "Staff updated" });
});

//Delete non admin staff
router.delete("/staff/:id",Protect,attachStaffRole,adminOnly,async (req, res) => {
  const staff = await Staff.findById(req.params.id).populate("roles.role");
  if (!staff) return res.status(404).json({ message: "Staff not found" });

  const role = staff.getCurrentRole();
  if (role?.role.name === "admin") {
    return res.status(403).json({ message: "Cannot delete admin" });
  }

  await Staff.findByIdAndDelete(req.params.id);
  res.json({ message: "Staff deleted" });
});


//Change non admin roles
router.put("/staff/:id/change-role",Protect,attachStaffRole,adminOnly,async (req, res) => {
  const { roleId } = req.body;

  const staff = await Staff.findById(req.params.id).populate("roles.role");
  if (!staff) return res.status(404).json({ message: "Staff not found" });

  const current = staff.getCurrentRole();
  if (current?.role.name === "admin") {
    return res.status(403).json({ message: "Cannot change admin role" });
  }

  await changeRole(staff, roleId);
  res.json({ message: "Role updated" });
});


export default router;