import { TransactionBlock } from "@mysten/sui.js/transactions";
import { MIST_PER_SUI } from "@mysten/sui.js/utils";

import {
  readJsonFile,
  derivePrivateKey,
  suiClient,
  getMetadata,
  getWalletInfo,
  saveJsonFile,
  logPitchTalk,
  readLine,
  getTransaction,
  getCoin,
} from "../utils/index.js";
import { META_PATH } from "../constants/index.js";

const metadata = getMetadata();
const CONTRACTS = metadata.tokens;

export default class Transfer {
  #mainWallet;
  #destinationAddress;

  constructor() {
    this.#mainWallet = metadata.mainWallet;
    this.#destinationAddress = metadata.destinationAddress;
  }

  #isValidMainWallet() {
    const mainMnemonic = this.#mainWallet?.mnemonic;

    return !!mainMnemonic;
  }

  async #updateMainWallet() {
    if (!this.#isValidMainWallet) {
      console.error(`Missing MAIN wallet information`);

      return;
    }

    const mainInfo = await getWalletInfo(this.#mainWallet.mnemonic);

    this.#mainWallet = mainInfo;

    const metadata = readJsonFile(META_PATH);

    metadata.mainWallet = this.#mainWallet;
    saveJsonFile(META_PATH, metadata);
  }

  // One-to-many
  async oneToMany(amount, coinType = CONTRACTS.SUI.name, { lower }) {
    await this.#updateMainWallet();

    const { meta, addresses } = await this.#getTransfers(
      amount,
      coinType,
      lower
    );

    const totalTransfer = amount * addresses.length;
    const balance = this.#mainWallet.balances[coinType].totalBalance;

    console.log(
      `Transfering ${totalTransfer} ${coinType} to ${addresses.length} addresses`
    );

    if (totalTransfer > balance) {
      console.error(
        `${balance} ${coinType} is not enough to transfer to ${addresses.length} addresses`
      );

      return;
    }

    const txb = new TransactionBlock();
    const coins = txb.splitCoins(
      txb.gas,
      addresses.map(() => meta.amount)
    );

    addresses.forEach((address, index) => {
      txb.transferObjects([coins[index]], address);
    });

    const { digest } = await suiClient.signAndExecuteTransactionBlock({
      signer: derivePrivateKey(this.#mainWallet.mnemonic),
      transactionBlock: txb,
    });

    console.log(
      `${digest} - Transfered ${totalTransfer} ${coinType} to ${addresses.length} addresses successfully!`
    );

    await this.#updateMainWallet();

    console.log(
      `${coinType} Balance: ${this.#mainWallet.balances[coinType].totalBalance}`
    );

    logPitchTalk();
  }

  async #getAddresses() {
    const addressPath = metadata.addressPath;
    if (!addressPath) {
      console.log(`Missing path to address list`);
    }

    return await readLine(addressPath);
  }

  async #getTransfers(amount, coinType, lowerThan) {
    const meta = {
      coinType,
      amount: amount * Number(MIST_PER_SUI),
    };
    const addresses = await this.#getAddresses();
    const wallets = [];

    for (let index = 0; index < addresses.length; index++) {
      const address = addresses[index];
      const info = await getWalletInfo(address);

      wallets.push(info);
    }

    let transferWallets = wallets;

    if (lowerThan) {
      transferWallets = transferWallets.filter(
        (wallet) => wallet.balances[coinType].totalBalance <= lowerThan
      );
    }

    transferWallets = transferWallets.map(({ address }) => address);

    return { meta, addresses: transferWallets };
  }

  // Many-to-one
  async manyToOne(coinType = CONTRACTS.SUI.name, { amount }) {
    const wallets = await this.#getWallets();

    const mergeTasks = wallets.map(async (wallet) => {
      await this.#mergeAll(wallet, coinType);
    });
    await Promise.allSettled(mergeTasks);

    const transferTasks = wallets.map(async (wallet) => {
      await this.transferObj(wallet, coinType, amount);
    });
    await Promise.allSettled(transferTasks);

    logPitchTalk();
  }

  async #getWallets() {
    const walletPath = metadata.walletPath;
    if (!walletPath) {
      console.log(`Missing path to wallet list`);
    }

    return await readLine(walletPath);
  }

  async #mergeAll(wallet, coinType) {
    if (coinType === "SUI") {
      await this.#reverseGas(wallet);
    }

    console.log(
      `Merging ${coinType} - Wallet: ${derivePrivateKey(wallet).toSuiAddress()}`
    );

    let coinList = await this.#getCoinList(wallet, coinType);

    if (coinType === "SUI") {
      coinList = coinList.slice(0, coinList.length - 1);
    }

    if (coinList.length <= 1) {
      console.warn("Just one. Stopped merging!");

      return;
    }

    const objIds = coinList.map((coin) => coin.coinObjectId);
    const [destination, ...source] = objIds;
    const txb = new TransactionBlock();

    txb.mergeCoins(destination, source);

    await suiClient
      .signAndExecuteTransactionBlock({
        signer: derivePrivateKey(wallet),
        transactionBlock: txb,
      })
      .then((response) => {
        console.log(
          `Merged ${coinType} completely - Digest: ${
            response.digest
          } - Wallet: ${derivePrivateKey(wallet).toSuiAddress()}`
        );
      });
  }

  async transferObj(wallet, coinType, splitAmount) {
    console.log(
      `Transfering ${coinType} - Wallet: ${derivePrivateKey(
        wallet
      ).toSuiAddress()}`
    );

    const coinList = await this.#getCoinList(wallet, coinType);

    if (coinList.length < 1) {
      console.log(`List of ${coinType} is Empty. Nothing to do. Stopped`);

      return;
    }

    const bigCoin = coinList[0];
    let amount = bigCoin.balance;

    if (splitAmount) {
      amount = splitAmount * Number(MIST_PER_SUI);

      if (amount > Number(bigCoin.balance)) {
        console.log(`Not enough ${coinType} to split. Stopped`);

        return;
      }
    }

    const txb = new TransactionBlock();
    const [coin] = txb.splitCoins(bigCoin.coinObjectId, [amount]);

    txb.transferObjects([coin], this.#destinationAddress);

    const { digest } = await suiClient.signAndExecuteTransactionBlock({
      signer: derivePrivateKey(wallet),
      transactionBlock: txb,
    });

    const { balanceChanges } = await getTransaction(digest);
    const sui = balanceChanges.find(
      (change) =>
        change.coinType === CONTRACTS.SUI.address &&
        change.owner.AddressOwner === derivePrivateKey(wallet).toSuiAddress()
    );
    const suiChanged = Number(sui.amount) / Number(MIST_PER_SUI);
    const happyChanged = 0.07;

    console.log(`SUI changed: ${suiChanged}`);

    if (suiChanged > 0) {
      console.log(`Earned ${suiChanged} SUI`);
    }
  }

  async #getCoinList(wallet, coinType) {
    let shouldGetCoin = false;
    let coinList = [];
    let cursor;

    do {
      const { data, hasNextPage, nextCursor } = await getCoin(
        derivePrivateKey(wallet).toSuiAddress(),
        CONTRACTS[coinType].name,
        cursor
      );

      coinList.push(...data);
      shouldGetCoin = hasNextPage;
      cursor = nextCursor;
    } while (shouldGetCoin);

    return coinList;
  }

  async #reverseGas(wallet) {
    const gasOffset = 0.01 * Number(MIST_PER_SUI);
    const txb = new TransactionBlock();
    const coin = txb.splitCoins(txb.gas, [gasOffset]);

    txb.transferObjects([coin], derivePrivateKey(wallet).toSuiAddress());

    const { digest } = await suiClient.signAndExecuteTransactionBlock({
      signer: derivePrivateKey(wallet),
      transactionBlock: txb,
    });

    await getTransaction(digest);
  }
}
