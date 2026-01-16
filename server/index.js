const { app } = require("./app");
const http = require("http");
const { PORT } = require("./config/keys");

const server = http.createServer(app)


server.listen(PORT, () => console.log("Server started successfully on port", PORT))