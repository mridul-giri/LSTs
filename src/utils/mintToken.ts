import {
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";

const connection = new Connection(process.env.HELIUS_RPC_URL!, "confirmed");

const privateKey = process.env.VAULT;
const mintAdd = new PublicKey(process.env.MINT_ADD!);
const keypair = Keypair.fromSecretKey(bs58.decode(privateKey!));

export async function minToken(fromAddress: string, amount: number) {
  const fromAddressPublickey = new PublicKey(fromAddress);

  const ataAddress = await getOrCreateAssociatedTokenAccount(
    connection,
    keypair,
    mintAdd,
    fromAddressPublickey,
    false,
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID
  );

  const result = await mintTo(
    connection,
    keypair,
    mintAdd,
    ataAddress.address,
    keypair,
    amount,
    [],
    undefined,
    TOKEN_2022_PROGRAM_ID
  );
  console.log("result:", result);
}
