import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

//Checks who the user it, and prevents unauthenticated folks from accessing protected routes
const authenticate = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer")) {
			return res.status(401).json({ message: "No token provided" });
		}

		const token = authHeader.split(" ")[1];

		let decoded;
		try {
			decoded = jwt.verify(token, process.env.JWT_SECRET);
		} catch (err) {
			return res.status(401).json({ message: "Invalid or expired token" });
		}

		const user = await User.findById(decoded.id).select("-password");

		if (!user) {
			return res
				.status(404)
				.json({ message: "User no longer exists", error: err.message });
		}

		req.user = user;
		next();
	} catch (err) {
		console.error("Auth middleware error:", err);
		return res
			.status(500)
			.json({ message: "Server error", error: err.message });
	}
};

export default authenticate;
