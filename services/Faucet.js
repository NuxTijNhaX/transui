import { isValidSuiAddress } from "@mysten/sui.js/utils";

import {
  getFaucet,
  logPitchTalk,
  getMetadata,
  derivePrivateKey,
  readLine,
} from "../utils/index.js";

const metadata = getMetadata();

export default class Faucet {
  static types = ["address", "wallet"];

  async faucet(address) {
    await getFaucet(address);

    logPitchTalk();
  }

  async faucetAll(type) {
    console.log(`Fauceting to all on ${type} path`);

    let list;

    if (type === Faucet.types[0]) {
      list = await this.#getAddresses();
    }

    if (type === Faucet.types[1]) {
      list = await this.#getWallets();
    }

    const waitingList = list.map(async (value) => {
      let address = value;
      if (!isValidSuiAddress(value)) {
        address = derivePrivateKey(value).toSuiAddress();
      }

      await getFaucet(address);
    });

    await Promise.allSettled(waitingList);

    logPitchTalk();
  }

  async #getAddresses() {
    const addressPath = metadata.addressPath;
    if (!addressPath) {
      console.log(`Missing path to address list`);
    }

    return await readLine(addressPath);
  }

  async #getWallets() {
    const walletPath = metadata.walletPath;
    if (!walletPath) {
      console.log(`Missing path to wallet list`);
    }

    return await readLine(walletPath);
  }
}
