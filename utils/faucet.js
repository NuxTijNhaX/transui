import { getFaucetHost, requestSuiFromFaucetV1 } from "@mysten/sui.js/faucet";
import { getMetadata } from "../utils/index.js";

const metadata = getMetadata();

export default async function getFaucet(address) {
  await requestSuiFromFaucetV1({
    host: getFaucetHost(metadata.env),
    recipient: address,
  });

  console.log(`Fauceted to ${address} successfully!`);
}
