const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
// const _ = require("lodash");
const { response } = require("express");
const messages = require("./messages.json");
const app = express();

app.use(cors(), bodyParser.json());

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

//shows all messages
app.get("/messages", function (req, res) {
  res.send(messages);
});

//shows by Id
app.get("/messages/:id", (req, res) => {
  const messageId = Number(req.params.id);

  const message = messages.find((message) => message.id === messageId);
  message
    ? res.send(message)
    : res.status(404).send("The message is not found");
});

//posts new message
app.post("/messages", function (req, res) {
  if (req.body.text && req.body.from) {
    const timeSent = new Date();
    const newMessage = { ...req.body, timeStamp: timeSent };
    messages.push(newMessage);
    res.send({ success: true, newMessage });
  } else {
    response.send(400, "Message could not send !");
  }
});

//shows last 10 messages
app.get("/messages/latest", function (req, res) {
  res.send(_.takeRight(messages, 10));
});

//deletes a message by Id
app.delete("/messages/:id", function (req, res) {
  const messageId = Number(req.params.id);

  messages = messages.filter((item) => item.id !== messageId);
  response.send({ success: true });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started ${PORT}`);
});
