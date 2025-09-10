import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import bs58 from "bs58";

const connection = new Connection(process.env.HELIUS_RPC_URL!, "confirmed");

const privateKey = process.env.VAULT;
const keypair = Keypair.fromSecretKey(bs58.decode(privateKey!));

export async function sendNativeToken(senderAddress: string, amount: number) {
  const ownerPublicKey = new PublicKey(process.env.VAULT_PUBLIC_KEY!);

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: ownerPublicKey,
      toPubkey: new PublicKey(senderAddress),
      lamports: amount * LAMPORTS_PER_SOL,
    })
  );

  const signature = await sendAndConfirmTransaction(connection, transaction, [
    keypair,
  ]);

  console.log("Signature:", signature);
}
