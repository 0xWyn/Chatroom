import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
	try {
		const { name, username, email, password } = req.body;

		if (!name.trim() || !username.trim() || !email.trim() || !password.trim()) {
			return res.status(400).json({ message: "All fields are required" });
		}

		const extantUser = await User.findOne({ $or: [{ email }, { username }] });
		if (extantUser) {
			return res
				.status(400)
				.json({ message: "Account with credentials already exists" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		let pictureUrl = "";
		if (req.file) {
			pictureUrl = `/uploads/${req.file.filename}`;
		}
		const user = new User({
			name,
			username: req.body.username.toLowerCase(),
			email: req.body.email.toLowerCase(),
			password: hashedPassword,
			avatar: pictureUrl,
		});

		await user.save();

		res.status(201).json({
			message: "Registration successful",
			user: {
				id: user._id,
				username: user.username,
				email: user.email,
				picture: user.picture,
			},
		});
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const login = async (req, res) => {
	try {
		const { identifier, password } = req.body;

		const normalisedIdentifier = identifier.toLowerCase().trim();
		const user = await User.findOne({
			$or: [
				{ email: normalisedIdentifier },
				{ username: normalisedIdentifier },
			],
		}).select("+password");

		if (!user) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		res.status(200).json({
			message: "Login successful",
			token,
			user: {
				id: user._id,
				username: user.username,
				email: user.email,
				picture: user.picture,
			},
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ messsage: "Server error" });
	}
};
