import { setupCmds } from "../commands/index.js";
import Setup from "../services/Setup.js";

export async function setup(args, type) {
  try {
    const setup = new Setup();
    const commandKey = Object.keys(setupCmds).find(
      (key) => setupCmds[key].name === type
    );
    const command = setupCmds[commandKey];

    await setup[command.action](...args);
  } catch (error) {}
}
