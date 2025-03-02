import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";

export const createToken = (email: string, expires: number) => {
  const options: SignOptions = {
    expiresIn: expires,
  };
  const token = jwt.sign({ email }, process.env.JWT_SECRET as Secret, options);
  return token;
};

export const verifyToken = (token: string) => {
  const user = jwt.verify(
    token,
    process.env.JWT_SECRET as Secret
  ) as JwtPayload;
  return user;
};

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 12);
};

export const validatePassword = async (
  userPassword: string,
  hashPassword: string
) => {
  return await bcrypt.compare(userPassword, hashPassword);
};
