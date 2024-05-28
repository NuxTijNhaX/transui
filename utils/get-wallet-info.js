import { isValidSuiAddress } from "@mysten/sui.js/utils";
import {
  getMetadata,
  getBalance,
  derivePrivateKey,
  convertBalance,
} from "./index.js";

const metadata = getMetadata();

export default async function getWalletInfo(value) {
  let address = value;
  if (!isValidSuiAddress(value)) {
    address = derivePrivateKey(value).toSuiAddress();
  }

  const balances = {};

  for (const key of Object.keys(metadata.tokens)) {
    const { coinObjectCount, totalBalance } = await getBalance(
      address,
      metadata.tokens[key].name
    );

    balances[key] = {
      coinObjectCount,
      totalBalance: convertBalance(totalBalance),
    };
  }

  return {
    ...(!isValidSuiAddress(value) && { mnemonic: value }),
    address,
    balances,
  };
}
