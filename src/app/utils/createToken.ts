import jwt from "jsonwebtoken";

const createToken = (email: string, expires: number) => {
  const options: jwt.SignOptions = {
    expiresIn: expires,
  };
  const token = jwt.sign({ email }, process.env.JWT_SECRET as string, options);
  return token;
};

export default createToken;
