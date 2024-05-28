#! /usr/bin/env node

import { program, Argument, Option } from "commander";

import * as cmds from "./commands/index.js";
import * as controllers from "./controller/index.js";

program
  .name("transui")
  .description("Help you transfer the tokens in SUI with just a few words")
  .version("1.0.0");

Object.keys(controllers).map((key) => {
  const keyCmd = `${key}Cmds`;
  const cmdList = cmds[keyCmd];
  const controller = controllers[key];
  const mainCommand = program.command(key);

  Object.keys(cmdList).forEach((command) => {
    // Setup Sub-command
    const subCommand = mainCommand
      .command(cmdList[command].name)
      .description(cmdList[command].description);

    // Setup Args
    const argList = cmdList[command]?.arguments || [];

    argList.map((arg) => {
      const argumentInstance = new Argument(arg.name, arg.description);
      const choices = arg.choices || [];
      const defaultValue = arg?.default?.value;

      if (choices.length > 0) argumentInstance.choices(arg.choices);
      // if (defaultValue)
      //   argumentInstance.default(defaultValue, arg.default.description);

      subCommand.addArgument(argumentInstance);
    });

    // Setup Required Options
    const requiredOtps = cmdList[command]?.requiredOptions || [];

    requiredOtps.map((otp) => {
      const optionInstance = new Option(otp.flags, otp.description);
      const choices = otp.choices || [];
      const defaultValue = otp?.default?.value;

      if (choices.length > 0) optionInstance.choices(otp.choices);
      // if (defaultValue)
      //   argumentInstance.default(defaultValue, arg.default.description);

      subCommand.addOption(optionInstance);
    });

    // Build action
    subCommand.action(async (...args) => {
      await controller(args, cmdList[command].name);
    });
  });
});

program.parse();
