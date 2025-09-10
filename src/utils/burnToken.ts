import {
  createBurnCheckedInstruction,
  getOrCreateAssociatedTokenAccount,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";
import bs58 from "bs58";

const connection = new Connection(process.env.HELIUS_RPC_URL!, "confirmed");
const privateKey = process.env.VAULT;
const keypair = Keypair.fromSecretKey(bs58.decode(privateKey!));

export async function burnToken(senderAddress: string, tokenAmount: number) {
  const mintAdd = new PublicKey(process.env.MINT_ADD!);
  const ownerPublicKey = new PublicKey(process.env.VAULT_PUBLIC_KEY!);

  const ataAddress = await getOrCreateAssociatedTokenAccount(
    connection,
    keypair,
    mintAdd,
    ownerPublicKey,
    false,
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID
  );

  const burnBlockhash = await connection.getLatestBlockhash();

  const burnInstruction = createBurnCheckedInstruction(
    ataAddress.address,
    mintAdd,
    ownerPublicKey,
    BigInt(tokenAmount * 10 ** 9),
    9,
    [],
    TOKEN_2022_PROGRAM_ID
  );

  const burnTransaction = new Transaction({
    feePayer: ownerPublicKey,
    blockhash: burnBlockhash.blockhash,
    lastValidBlockHeight: burnBlockhash.lastValidBlockHeight,
  }).add(burnInstruction);

  const transaction = await sendAndConfirmTransaction(
    connection,
    burnTransaction,
    [keypair]
  );

  console.log(`Burn Transaction: ${transaction}`);
}
