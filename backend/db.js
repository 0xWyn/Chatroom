import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, "data", "db.json");

export async function readDB() {
    const data = await readFile(DB_PATH, "utf-8");
    return JSON.parse(data);
}

export async function writeDB(data) {
    await writeFile(DB_PATH, JSON.stringify(data, null, 2));
}
