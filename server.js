const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const mongodb = require("mongodb");
const mongoOptions = { useUnifiedTopology: true };

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3000;

const uri = process.env.DATABASE_URI;

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

//shows all messages
app.get("/messages", function (request, response) {
  //   res.send(messages);

  const client = new mongodb.MongoClient(uri);

  client.connect(function () {
    const db = client.db("messages");
    const collection = db.collection("messages");

    const searchObject = {};

    if (request.query.from) {
      searchObject.from = request.query.from;
    }

    if (request.query.text) {
      searchObject.text = request.query.text;
    }

    collection.find(searchObject).toArray(function (error, messages) {
      response.send(error || messages);
      client.close();
    });
  });
});

//shows by Id
app.get("/messages/:id", (request, response) => {
  // const messageId = Number(req.params.id);

  // const message = messages.find((message) => message.id === messageId);
  // message
  //   ? res.send(message)
  //   : res.status(404).send("The message is not found");
  const client = new mongodb.MongoClient(uri);

  let id;
  try {
    id = new mongodb.ObjectID(request.params.id);
  } catch (error) {
    response.sendStatus(400);
    return;
  }

  client.connect(function () {
    const db = client.db("messages");
    const collection = db.collection("messages");

    const searchObject = { _id: id };

    collection.findOne(searchObject, function (error, book) {
      if (!book) {
        response.sendStatus(404);
      } else {
        response.send(error || book);
      }

      client.close();
    });
  });
});

//posts new message
app.post("/messages", function (request, response) {
  // if (req.body.text && req.body.from) {
  //   const timeSent = new Date();
  //   // const newMessage = { ...req.body, timeStamp: timeSent, id: };
  //   const newMessage = {
  //     id: messages.length,
  //     from: req.body.from,
  //     text: req.body.text,
  //     timeStamp: timeSent,
  //   };
  //   messages.push(newMessage);
  //   res.send({ success: true, newMessage });
  // } else {
  //   res.send(400, "Message could not send !");
  // }
  const client = new mongodb.MongoClient(uri, mongoOptions);
  const timeSent = new Date();
  const message = {
    from: request.body.from,
    text: request.body.text,
    timeStamp: timeSent,
  };
  client.connect(function () {
    const db = client.db("messages");
    const collection = db.collection("messages");

    collection.insertOne(message, function (error, result) {
      response.send(error || result.ops[0]);
      client.close();
    });
  });
});

// shows last 10 messages
// app.get("/messages/latest", (req, res) => {
//   const latestMessages = messages.slice(messages.length - 10, messages.length);
//   res.send(latestMessages);
// });

//deletes a message by Id
app.delete("/messages/:id", function (request, response) {
  // // const messageId = Number(req.params.id);

  // // messages = messages.filter((item) => item.id !== messageId);
  // // response.send({ success: true });

  // const { id } = req.params;
  // const filteredMessages = messages.filter((message) => {
  //   // console.log(typeof message.id, message.id, typeof Number(id), Number(id));
  //   return message.id !== Number(id);
  // });
  // if (filteredMessages.length !== messages.length) {
  //   messages = filteredMessages;
  //   res.send(messages);
  // } else {
  //   res.sendStatus(404);
  // }
  const client = new mongodb.MongoClient(uri, mongoOptions);

  if (!mongodb.ObjectId.isValid(request.params.id)) {
    response.sendStatus(400);
    return;
  }

  client.connect(function () {
    const db = client.db("messages");
    const collection = db.collection("messages");
    const deleteObject = { _id: mongodb.ObjectId(request.params.id) };

    collection.deleteOne(deleteObject, function (error, result) {
      if (error) {
        response.status(500).send(error);
      } else if (result.deletedCount) {
        response.sendStatus(204);
      } else {
        response.sendStatus(404);
      }
      client.close();
    });
  });
});

app.put("/messages/:id", function (request, response) {
  // Also make this work!
  const client = new mongodb.MongoClient(uri, mongoOptions);

  if (!mongodb.ObjectId.isValid(request.params.id)) {
    response.sendStatus(420);
    return;
  }
  client.connect(function () {
    const db = client.db("messages");
    const collection = db.collection("messages");
    const searchObject = { _id: mongodb.ObjectId(request.params.id) };

    const updateObject = {
      $set: {
        from: request.body.from,
        text: request.body.text,
      },
    };

    const options = { returnOriginal: false };

    collection.findOneAndUpdate(searchObject, updateObject, options, function (
      error,
      result
    ) {
      if (result.value) {
        response.send(result.value);
      } else if (error) {
        response.status(503).send(error);
      } else {
        response.sendStatus(404);
      }
      client.close;
    });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started ${PORT}`);
});
