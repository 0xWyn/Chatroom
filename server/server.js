import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import accessRoutes from "./routes/accessRoutes.js";
import basicPaths from "./routes/basicPaths.js";
import postRoutes from "./routes/postRoutes.js";
import { UPLOADS_DIR } from "./config/paths.js";

dotenv.config();

const port = process.env.PORT || 5555;
const mongoURI = process.env.MONGO_URI;

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve uploaded files
app.use("/uploads", express.static(UPLOADS_DIR));

// Routes
app.use("/api/auth", accessRoutes);

app.use("/api", basicPaths);
app.use("/api/post", postRoutes);

mongoose
	.connect(mongoURI)
	.then(() => {
		console.log("App connected to mongoDB");
		app.listen(port, () => {
			console.log(`App live @ port:${port}`);
		});
	})
	.catch((error) => {
		console.log(error);
	});
