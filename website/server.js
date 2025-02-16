import express from "express";
import path from "path";

const app = express();

// const basePath = "/lisn.js";
const basePath = "/";
app.use(basePath, express.static(path.join(import.meta.dirname, "out")));
app.listen(3000, () => {
  console.log(`Server is running at http://localhost:3000${basePath}`);
});
