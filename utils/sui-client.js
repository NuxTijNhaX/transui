import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import { getMetadata } from "./index.js";

const metadata = getMetadata();
const suiClient = new SuiClient({ url: getFullnodeUrl(metadata.env) });

export default suiClient;
