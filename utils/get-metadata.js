import path from "path";

import { META_PATH } from "../constants/index.js";
import { readJsonFile } from "./index.js";

export default function getMetadata() {
  const metaPath = path.resolve(META_PATH);
  const metadata = readJsonFile(metaPath);

  return metadata;
}
