import { transferCmds } from "../commands/index.js";
import Transfer from "../services/Transfer.js";

export async function transfer(args, type) {
  try {
    const transfer = new Transfer();
    const commandKey = Object.keys(transferCmds).find(
      (key) => transferCmds[key].name === type
    );
    const command = transferCmds[commandKey];

    await transfer[command.action](...args);
  } catch (error) {}
}
