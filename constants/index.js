import path from "path";

const DONATE_PITCH =
  "💵 HELP ME WITH YOUR SUI BY DONATING TO MY ADDRESS: 0x479a64195eeaaf1cc3b6eacc4d4e5260753ebb9c521b7c373c2c367d3ba7da03 | 🙏🙏🙏 Thanks a lot 🙏🙏🙏";
const OCEAN_PITCH =
  "👉 EARN SUI BY MINING OCEAN WITH MY INVITE LINK: 🌐 t.me/waveonsuibot/walletapp?startapp=1391174";

const ENVS = {
  dev: "devnet",
  test: "testnet",
  main: "mainnet",
};

const WALLET_PATH = {
  JSON: path.resolve("data/wallet.json"),
};

const META_PATH = path.resolve("data/meta/index.json");

const LIMIT_PAGE = 10;

export {
  ENVS,
  WALLET_PATH,
  META_PATH,
  LIMIT_PAGE,
  DONATE_PITCH,
  OCEAN_PITCH,
};
