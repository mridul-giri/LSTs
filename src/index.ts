import "dotenv/config";
import express from "express";
import { mintToken } from "./utils/mintToken.js";
import { burnToken } from "./utils/burnToken.js";
import { sendNativeToken } from "./utils/sendNativeToken.js";

const app = express();
app.use(express.json());

app.post("/", async (req, res) => {
  console.log("Native Transfer: ", req.body[0].nativeTransfers);
  console.log("Token Transfer: ", req.body[0].tokenTransfers);

  try {
    const transactionData = req.body[0];
    if (
      transactionData.type == "TRANSFER" &&
      transactionData.nativeTransfers.length > 0
    ) {
      for (const transfer of transactionData.nativeTransfers) {
        const fromUserAccount = transfer.fromUserAccount;
        const transferAmount = transfer.amount;
        if (transfer.toUserAccount == process.env.VAULT_PUBLIC_KEY!) {
          await mintToken(fromUserAccount, transferAmount);
        } else {
          return res.status(200).send("ignored");
        }
      }
      return res.status(200).send("Token Minted");
    } else {
      for (const token of transactionData.tokenTransfers) {
        const fromUserAccount = token.fromUserAccount;
        const transferAmount = token.tokenAmount;
        await burnToken(fromUserAccount, transferAmount);
        await sendNativeToken(fromUserAccount, transferAmount);
        return res.status(200).send("Token Minted");
      }
    }
  } catch (error) {
    console.error("ERROR:", error);
    return res.status(500).send("Server error");
  }
});

app.listen(3000, () => console.log("Server is listening"));
