import Faucet from "../services/Faucet.js";

export const faucetCmds = {
  FAUCET: {
    name: "get",
    description: "get faucet token",
    action: "faucet",
    arguments: [
      {
        name: "[address]",
        description: "address",
      },
    ],
  },
  FAUCET_ALL: {
    name: "all",
    description: "get faucet token to list",
    action: "faucetAll",
    arguments: [
      {
        name: "[type]",
        description: "type of source",
        choices: Faucet.types,
      },
    ],
  },
};
