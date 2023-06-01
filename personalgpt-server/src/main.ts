import * as dotenv from "dotenv";
dotenv.config();

import server from "./server";

const port = 8000;

server.listen(port, () => {
  console.log(`BetterGPT Server listening on port ${port}`);
});
