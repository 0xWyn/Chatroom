import { promises as fsPromises } from "fs";
import path from "path";

export default async function deleteFiles(fileInput = []) {
    const fileArray = Array.isArray(fileInput)
        ? fileInput
        : fileInput
          ? [fileInput.fileName || fileInput]
          : [];

    const deletePromises = fileArray.map(async (fileName) => {
        try {
            const fullPath = path.join(process.cwd(), "uploads", fileName);
            console.log("From deleteFiles fn:", fullPath);
            await fsPromises.unlink(fullPath);
        } catch (error) {
            console.error("Error deleting file", error);
        }
    });

    await Promise.all(deletePromises);
}
