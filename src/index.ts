import "dotenv/config";
import express from "express";
import { minToken } from "./utils/mintToken.js";

const app = express();
app.use(express.json());

app.post("/", async (req, res) => {
  console.log(req.body[0].nativeTransfers);

  try {
    const transactionData = req.body[0];
    if (
      transactionData.type !== "TRANSFER" &&
      transactionData.nativeTransfers.length == 0
    ) {
      console.log("Invalid transaction");
      return res.status(200).send("Ignored");
    }

    for (const transfer of transactionData.nativeTransfers) {
      if (process.env.VAULT_PUBLIC_KEY !== transfer.toUserAccount) {
        console.log("Wrong receiver address");
        return res.status(200).send("Ignored");
      }
      const fromUserAccount = transfer.fromUserAccount;
      const transferAmount = transfer.amount;
      await minToken(fromUserAccount, transferAmount);
    }
    return res.status(200).send("Token Minted");
  } catch (error) {
    console.error("ERROR:", error);
    return res.status(500).send("Server error");
  }
});

app.listen(3000, () => console.log("Server is listening"));
