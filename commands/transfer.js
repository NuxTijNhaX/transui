import { getMetadata } from "../utils/index.js";

const metadata = getMetadata();
const CONTRACTS = metadata.tokens;
const coinTypes = Object.keys(CONTRACTS).map(
  (contractKey) => CONTRACTS[contractKey].name
);

export const transferCmds = {
  GET_COIN: {
    name: "get-coin",
    description: "get coin information",
    action: "getCoin",
    arguments: [
      {
        name: "[coinType]",
        description: "type of coin",
        choices: coinTypes,
      },
    ],
  },
  ONE_MANY: {
    name: "one-many",
    description: "bulk transfer token, one-to-many",
    action: "oneToMany",
    arguments: [
      {
        name: "<amount>",
        description: "amount token",
        default: {
          value: 0.35,
        },
      },
      {
        name: "[coinType]",
        description: "type of coin",
        choices: coinTypes,
      },
    ],
    requiredOptions: [
      {
        flags: "--lower <value>",
        description: "transfer when lower than",
      },
    ],
  },
  MANY_ONE: {
    name: "many-one",
    description: "many-to-one transfer token",
    action: "manyToOne",
    arguments: [
      {
        name: "[coinType]",
        description: "type of coin",
        choices: coinTypes,
      },
    ],
    requiredOptions: [
      {
        flags: "--amount <amount>",
        description: "amount token",
      },
    ],
  },
};
