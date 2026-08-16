import bcrypt from "bcrypt";

export const hash = async (plainText) => {
    return bcrypt.hash(plainText, 12);
}

export const compareHash = (plainText, hashValue) => {
  return bcrypt.compare(plainText, hashValue);
}