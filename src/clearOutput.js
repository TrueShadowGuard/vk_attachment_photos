import path from "path";
import fs from "fs/promises";

export default async function clearOutput() {
    const files = await fs.readdir(path.resolve("output"));
    files.filter(file => file !== ".gitkeep").forEach(file => fs.unlink(path.resolve("output", file)));
}