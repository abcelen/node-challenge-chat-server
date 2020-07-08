const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { response } = require("express");
let messages = require("./messages.json");
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
    // const newMessage = { ...req.body, timeStamp: timeSent, id: };
    const newMessage = {
      id: messages.length,
      from: req.body.from,
      text: req.body.text,
      timeStamp: timeSent,
    };
    messages.push(newMessage);
    res.send({ success: true, newMessage });
  } else {
    response.send(400, "Message could not send !");
  }
});

//shows last 10 messages
app.get("/messages/latest", (req, res) => {
  const latestMessages = messages.slice(messages.length - 10, messages.length);
  res.send(latestMessages);
});

//deletes a message by Id
app.delete("/messages/:id", function (req, res) {
  // const messageId = Number(req.params.id);

  // messages = messages.filter((item) => item.id !== messageId);
  // response.send({ success: true });

  const { id } = req.params;
  const filteredMessages = messages.filter((message) => {
    // console.log(typeof message.id, message.id, typeof Number(id), Number(id));
    return message.id !== Number(id);
  });
  if (filteredMessages.length !== messages.length) {
    messages = filteredMessages;
    res.send(messages);
  } else {
    res.sendStatus(404);
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started ${PORT}`);
});
