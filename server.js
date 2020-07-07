const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { response } = require("express");

const app = express();

app.use(cors(), bodyParser.json());

const welcomeMessage = {
  id: 0,
  from: "Bart",
  text: "Welcome to CYF chat system!",
};

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
const messages = [welcomeMessage];

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});

//read all
app.get("/messages", function (req, res) {
  res.send(messages);
});

//show by Id
app.get("/messages/:id", (req, res) => {
  const messageId = Number(req.params.id);

  const message = messages.find((message) => message.id === messageId);
  message
    ? res.send(message)
    : res.status(404).send("The message is not found");
});

//post new message
app.post("/messages", function (req, res) {
  console.log(req.body);
  const newMessage = req.body;
  messages.push(newMessage);
  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started ${PORT}`);
});
