import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join((process.cwd(), ".env")) });

import app from "./app";

async function server() {
  const server = app.listen(process.env.PORT, () => {
    console.log("Health care server running");
  });
}

server();
