import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

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
