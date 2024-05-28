import fs from "fs";
import readline from "readline";

export default function readLine(path) {
  return new Promise((resolve, reject) => {
    const file = readline.createInterface({
      input: fs.createReadStream(path),
    });
    const allLine = [];

    file.on("line", async (line) => {
      allLine.push(line);
    });

    file.on("close", () => {
      resolve(allLine);
    });

    file.on("error", (error) => {
      reject(error);
    });
  });
}
