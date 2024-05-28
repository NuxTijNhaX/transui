import fs from "fs";
import path from "path";

export default function saveJsonFile(filepath, jsonData) {
  const realFilepath = path.resolve(filepath);
  fs.writeFileSync(realFilepath, JSON.stringify(jsonData, null, 2));
}
