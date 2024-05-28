import { suiClient } from "./index.js";

export default async function getTransaction(digest) {
  const transactionBlock = await suiClient.waitForTransactionBlock({
    digest,
    options: {
      showBalanceChanges: true,
    },
  });

  return transactionBlock;
}
