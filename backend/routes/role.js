import express from 'express';
const router = express.Router();
import Role from '../models/Role.js';
import getNextSequenceValue from '../utils/sequence.js';
const prefix = "ROLE-";
import multer from 'multer';
import path from 'path';
import { Protect } from '../middleware/authStaff.js';
import { adminOnly, firstLvlAdmin ,attachStaffRole} from "../middleware/authorization.js";





//Add role
router.post("/",Protect,attachStaffRole,firstLvlAdmin,async (req, res) => {
    try {
      const { name, salary, permissions } = req.body;

      const exists = await Role.findOne({ name });
      if (exists) {
        return res.status(400).json({ message: "Role already exists" });
      }

      const role = await Role.create({
        name,
        salary,
        permissions
      });

      res.status(201).json({
        message: "Role created successfully",
        role
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);



//delete role
router.delete("/:id",Protect,attachStaffRole,firstLvlAdmin,async (req, res) => {
    try {
      const role = await Role.findById(req.params.id);
      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }

      // Safety: prevent deleting admin roles accidentally
      if (["admin", "firstlevelAdmin"].includes(role.name)) {
        return res
          .status(403)
          .json({ message: "Core roles cannot be deleted" });
      }

      await role.deleteOne();

      res.json({ message: "Role deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);



//update role
router.put("/:id",Protect,attachStaffRole,firstLvlAdmin,async (req, res) => {
    try {
      const role = await Role.findById(req.params.id);
      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }

      const { salary, permissions } = req.body;

      if (salary) role.salary = salary;
      if (permissions) role.permissions = permissions;

      await role.save();

      res.json({
        message: "Role updated successfully",
        role
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);


//get role
router.get("/roles",async (req, res) => {
    try {
      const roles = await Role.find();
      res.json(roles);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);


//get all roles
router.get("/",Protect,attachStaffRole,adminOnly,async (req, res) => {
    try {
        const roles = await Role.find();
        res.json(roles);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "Error fetching roles", error: err.message });
    }
});
export default router;