import jwt, { JwtPayload } from "jsonwebtoken";

export const createToken = (email: string, expires: number) => {
  const options: jwt.SignOptions = {
    expiresIn: expires,
  };
  const token = jwt.sign({ email }, process.env.JWT_SECRET as string, options);
  return token;
};

export const verifyToken = (token: string) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  return decoded;
};
