import { LIMIT_PAGE } from "../constants/index.js";
import { suiClient, getMetadata } from "./index.js";

const metadata = getMetadata();
const CONTRACTS = metadata.tokens;

export default async function getCoin(address, coinName, cursor) {
  const result = await suiClient.getCoins({
    coinType: CONTRACTS[coinName].address,
    owner: address,
    limit: LIMIT_PAGE,
    cursor,
  });

  return result;
}
