import fs from "fs";
import path from "path";

export default function readJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(filePath)));
}
