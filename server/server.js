import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import basicPaths from "./routes/basicPaths.js";

dotenv.config();

const port = process.env.PORT || 5555;
const mongoURI = process.env.MONGO_URI;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);

app.use("/api", basicPaths);

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

// mongoose
// 	.connect(mongoURI)
// 	.then(async () => {
// 		console.log("Connected to DB");

// 		const result = await User.deleteMany({});
// 		console.log(`Deleted ${result.deletedCount} users`);

// 		mongoose.connection.close();
// 	})
// 	.catch((err) => console.error(err));
