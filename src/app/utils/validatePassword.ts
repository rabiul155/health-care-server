import bcrypt from "bcrypt";

async function validatePassword(userPassword: string, hashPassword: string) {
  return await bcrypt.compare(userPassword, hashPassword);
}

export default validatePassword;
