const express = require("express");
const app = express();
const expressWs = require("express-ws")(app);
const aWss = expressWs.getWss("/");

const port = process.env.PORT || 8080;
const authToken = process.env.AUTH_TOKEN || "demo-key";

app.use("/", (req, res, next) => {
  const token = req.headers["authorization"];

  if (token !== authToken) {
    res.status(401).send("unauthorized");
  }

  next();
});

app.ws("/", (ws, _) => {
  ws.on("message", (msg) => {
    aWss.clients.forEach((client) => {
      client.send(msg);
    });
  });
});

app.listen(port, () => console.log(`Listening on *:${port}`));
