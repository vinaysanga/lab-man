import { hash } from "@node-rs/argon2";
import { hash as cryptoHash } from "crypto";
export const generatePassword = (username: string): string => {
  const secret = "long-live-the-secret";
  const hashed = cryptoHash("sha256", `${username}${secret}`);
  return hashed.substring(0, 8);
};
export const hashPassword = async (password: string) => {
  // recommended minimum parameters
  return await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
};