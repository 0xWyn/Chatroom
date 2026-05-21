import { readDB, writeDB } from "../db.js";
import bcrypt from "bcryptjs";

export const createAccount = async (req, res) => {
    try {
        const db = await readDB();
        const { name, username, email, password } = req.body;
        const usernameTaken = Object.values(db.users).some(
            (user) => user.username === username
        );
        if (usernameTaken) {
            return res.status(400).json({ error: "Username already taken" });
        }
        const userExists = Object.values(db.users).some(
            (user) => user.email.toLowerCase() === email.toLowerCase()
        );
        if (userExists) {
            return res.status(400).json({ error: "Email already registered" });
        }
        const id = crypto.randomUUID();
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id,
            name,
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            password: hashedPassword,
            bio: "",
            avatar: null,
            cover: null,
            friends: [],
            createdAt: Date.now(),
        };
        db.users[id] = newUser;
        await writeDB(db);
        res.json({ msg: "Account created successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const loginFunction = async (req, res) => {
    try {
        const db = await readDB();
        const { identifier, password } = req.body;
        const user = identifier.includes("@")
            ? Object.values(db.users).find(
                  (user) =>
                      user.email.toLowerCase() === identifier.toLowerCase()
              )
            : Object.values(db.users).find(
                  (user) =>
                      user.username.toLowerCase() === identifier.toLowerCase()
              );
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!user || !passwordMatch) {
            return res.status(400).json({ error: error });
        }
        const userDetails = {
            id: user.id,
            name: user.name,
            username: user.username,
            friends: user.friends,
            following: user.following,
            followers: user.followers,
            bio: user.bio,
            avatar: user.avatar,
            cover: user.cover,
            createdAt: user.createdAt,
        };
        res.json(userDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
