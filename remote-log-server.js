import { Server } from "socket.io";
import eiows from "eiows";

const io = new Server(9000, {
  serveClient: false,
  wsEngine: eiows.Server,
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

function prefix(socket) {
  return `[${new Date().toISOString()}] [${socket.handshake.address}]`;
}

io.sockets.on("connection", function (socket) {
  socket.on("console.debug", function (...args) {
    console.debug("\x1b[34mDEBUG: " + prefix(socket), ...args, "\x1b[0m");
  });
  socket.on("console.log", function (...args) {
    console.log("\x1b[35mLOG:   " + prefix(socket), ...args, "\x1b[0m");
  });
  socket.on("console.info", function (...args) {
    console.info("\x1b[32mINFO:  " + prefix(socket), ...args, "\x1b[0m");
  });
  socket.on("console.warn", function (...args) {
    console.warn("\x1b[30;43mWARN:  " + prefix(socket), ...args, "\x1b[0m");
  });
  socket.on("console.error", function (...args) {
    console.error("\x1b[97;41mERROR: " + prefix(socket), ...args, "\x1b[0m");
  });
});
