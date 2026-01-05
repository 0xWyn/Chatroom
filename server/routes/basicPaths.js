import express from "express";
import User from "../models/UserModel.js";

const router = express.Router();

router.get("/", (req, res) => {
	res.send("Hello from the backend!");
});

router.get("/users", async (req, res) => {
	try {
		const users = await User.find({}).select("username email _id password");
		return res.status(200).json({
			data: users,
		});
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({ message: error.message });
	}
});

export default router;
