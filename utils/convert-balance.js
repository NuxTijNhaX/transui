import { MIST_PER_SUI } from "@mysten/sui.js/utils";

export default function convertBalance(totalBalance) {
  return Number.parseInt(totalBalance) / Number(MIST_PER_SUI);
}
