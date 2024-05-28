import { faucetCmds } from "../commands/index.js";
import Faucet from "../services/Faucet.js";

export async function faucet(args, type) {
  try {
    const faucet = new Faucet();
    const commandKey = Object.keys(faucetCmds).find(
      (key) => faucetCmds[key].name === type
    );
    const command = faucetCmds[commandKey];

    await faucet[command.action](...args);
  } catch (error) {}
}
