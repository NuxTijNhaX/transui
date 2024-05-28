import {
  saveJsonFile,
  readJsonFile,
  logPitchTalk,
  getWalletInfo,
} from "../utils/index.js";
import { META_PATH } from "../constants/index.js";

export default class Setup {
  show() {
    const metadata = readJsonFile(META_PATH);
    const sensitiveWallet = metadata.mainWallet;

    delete metadata.mainWallet;

    for (const key in metadata) {
      console.log(`${key} = ${JSON.stringify(metadata[key], null, 2)}`);
    }

    sensitiveWallet.mnemonic = `${sensitiveWallet.mnemonic.slice(
      0,
      15
    )} ... ${sensitiveWallet.mnemonic.slice(
      sensitiveWallet.mnemonic.length - 15
    )}`;

    console.log(`mainWallet = ${JSON.stringify(sensitiveWallet, null, 2)}`);

    logPitchTalk();
  }

  setEnv(env) {
    const metadata = readJsonFile(META_PATH);

    metadata.env = env;
    saveJsonFile(META_PATH, metadata);

    this.show();
  }

  setAddressPath(path) {
    const metadata = readJsonFile(META_PATH);

    metadata.addressPath = path;
    saveJsonFile(META_PATH, metadata);

    this.show();
  }

  setWalletPath(path) {
    const metadata = readJsonFile(META_PATH);

    metadata.walletPath = path;
    saveJsonFile(META_PATH, metadata);

    this.show();
  }

  addToken(name, address) {
    const metadata = readJsonFile(META_PATH);

    metadata.tokens[name] = {
      name,
      address,
    };

    saveJsonFile(META_PATH, metadata);

    this.show();
  }

  deleteToken(name) {
    const metadata = readJsonFile(META_PATH);

    delete metadata.tokens[name];

    saveJsonFile(META_PATH, metadata);

    this.show();
  }

  async addMainWallet(mnemonic) {
    const mainWallet = await getWalletInfo(mnemonic);
    const metadata = readJsonFile(META_PATH);

    metadata.mainWallet = mainWallet;
    saveJsonFile(META_PATH, metadata);

    this.show();
  }

  addDestinationAddress(address) {
    const metadata = readJsonFile(META_PATH);

    metadata.destinationAddress = address;
    saveJsonFile(META_PATH, metadata);

    this.show();
  }
}
