const dotenv = require("dotenv");
dotenv.config();

const server = require("./server");

const PORT = process.env.PORT || 3000;

console.log("Listening on port:", PORT);

server.listen(PORT);
