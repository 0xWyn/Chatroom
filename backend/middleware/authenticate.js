import { readDB, writeDB } from "../db.js";

const authenticate = async (req, res, next) => {
    try {
        console.log(req);
        const db = await readDB();
        const user = JSON.parse(localStorage.getItem("user"));

        const exists = db.users[user.id];

        if (!exists) {
            return res.status(404).json({
                message: "Failed to authenticate user",
            });
        }

        req.user = exists;
        next();
    } catch (error) {
        console.error(error);
    }
};

export default authenticate;
