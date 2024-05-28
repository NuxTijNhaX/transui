import { ENVS } from "../constants/index.js";

const envs = Object.keys(ENVS).map((key) => ENVS[key]);

export const setupCmds = {
  SHOW: {
    name: "show",
    description: "show configuration variables",
    action: "show",
  },
  SET_ENV: {
    name: "set-env",
    description: "set environment variable",
    action: "setEnv",
    arguments: [
      {
        name: "[env]",
        description: "type of environment",
        choices: envs,
      },
    ],
  },
  SET_WALLET_PATH: {
    name: "set-wallet-path",
    description: "set the path of your wallets, to transfer many-to-one",
    action: "setWalletPath",
    arguments: [
      {
        name: "[path]",
        description: "folder path",
      },
    ],
  },
  SET_ADDRESS_PATH: {
    name: "set-address-path",
    description: "set the path of your addresses, to transfer one-to-many",
    action: "setAddressPath",
    arguments: [
      {
        name: "[path]",
        description: "folder path",
      },
    ],
  },
  ADD_TOKEN: {
    name: "add-token",
    description: "add token to Transui",
    action: "addToken",
    arguments: [
      {
        name: "[name]",
        description: "name of token",
      },
      {
        name: "[address]",
        description: "contract address",
      },
    ],
  },
  DELETE_TOKEN: {
    name: "delete-token",
    description: "delete token from Transui",
    action: "deleteToken",
    arguments: [
      {
        name: "[name]",
        description: "name of token",
      },
    ],
  },
  SET_MAIN_WALLET: {
    name: "set-main-wallet",
    description: "set main wallet",
    action: "addMainWallet",
    arguments: [
      {
        name: "[mnemonic]",
        description: "enter your main wallet's seed phrase",
      },
    ],
  },
  SET_DESTINATION_ADDRESS: {
    name: "set-dest-addr",
    description: "set destination address",
    action: "addDestinationAddress",
    arguments: [
      {
        name: "[address]",
        description: "enter your destination address",
      },
    ],
  },
  WALLET: {
    name: "wallet",
    description: "setup wallet information",
    action: "wallet",
  },
};
