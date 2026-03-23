import express from 'express';
import Staff from '../models/Staff.js';
import multer from 'multer';
import path from 'path';
import jwt from 'jsonwebtoken';
import role from '../models/Role.js';
import { Protect } from '../middleware/authStaff.js';
import { adminOnly,requireRole, firstLvlAdmin ,attachStaffRole} from "../middleware/authorization.js";
import generateToken from "../utils/generateToken.js";
const router = express.Router();

//Login
router.post('/login-staff', async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res
            .status(400)
            .json({ message: 'Please provide all required fields.' });
        }
        const staff = await Staff.findOne({ email }).populate("roles.role");
        if (!staff ||!(await staff.matchPassword(password))) {
            return res 
                .status(401)
                .json({message: 'Invalid credentials.'});
        }

        const currentRole = staff.getCurrentRole();

        let redirectPath = "/staff/profile";
        if (currentRole?.role.name === "admin") {
            redirectPath = "/admin/dashboard";
        }


            const token = generateToken(staff._id);
            res.status(200).json({
                _id: staff._id,
                name: staff.name,
                email: staff.email,
                role: currentRole.role.name,
                redirect: redirectPath,
                token,
            });
        } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }

});


//Me
router.get('/me',Protect,attachStaffRole, async (req, res) => {
    res.status(200).json(req.staff);
});

export default router;