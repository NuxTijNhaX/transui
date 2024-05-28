import { suiClient, getMetadata } from "./index.js";

const metadata = getMetadata();
const CONTRACTS = metadata.tokens;

export default async function getBalance(
  address,
  coinType = CONTRACTS.SUI.name
) {
  const balance = await suiClient.getBalance({
    coinType: CONTRACTS[coinType].address,
    owner: address,
  });

  return balance;
}
