import bcrypt from "bcryptjs";
import { useUser } from "../context/UserProvider";

export default async function userValidation(credentials) {
    const { users } = useUser();
    try {
        const exists = users.find((u) => u.username === credentials.username);
        if (exists) {
            const valid = bcrypt.compare(credentials.password, exists.password);

            if (!valid) {
                throw new Error("Invalid credentials");
            }

            return valid;
        }
    } catch (error) {
        console.error(error);
        console.log("Failed to validate user");
    }
}
