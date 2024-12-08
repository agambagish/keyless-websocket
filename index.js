const express = require("express");
const app = express();
const expressWs = require("express-ws")(app);
const aWss = expressWs.getWss("/");

const port = process.env.PORT || 8080;

app.ws("/", (ws, _) => {
  ws.on("message", async (msg) => {
    const payload = JSON.parse(msg);

    if (payload.type == "rfid:verify") {
      const v = await fetch(
        `https://keyless-client.vercel.app/api/user/${payload.uid}`
      );
      const data = await v.json();

      aWss.clients.forEach((client) => {
        client.send(JSON.stringify(data));
      });
    }

    aWss.clients.forEach((client) => {
      client.send(msg);
    });
  });
});

app.listen(port, () => console.log(`Listening on *:${port}`));
