const express = require("express");
const mongodb = require("mongodb");

const app = express();
app.use(express.json());
// Change to use IPv4 address
const connectionUrl = "mongodb://127.0.0.1:27017";
const client = new mongodb.MongoClient(connectionUrl);

client
  .connect()
  .then(() => console.log("Database connected"))
  .catch((error) => console.log(error));

const db = client.db("schoolDb");

const student = db.collection("student");

//add student
app.post("/student", (req, res, next) => {
  student
    .insertMany(req.body)
    .then(() => res.status(201).send("students adde successfully"))
    .catch(() => res.status(500))
    .then(() => res.status(201).send("student added succefully"))
    .catch((error) => res.status(500).send(error.message));
});

// get student

app.get("/student", (req, res, next) => {
  const { email } = req.query;
  student
    .findOne({ email: email })
    .then((data) => res.status(200).json(data))
    .catch((error) => res.status(500).send(error.message));
});
// update student

app.put("/student", (req, res, next) => {
  const { age } = req.query;
  const { dept } = req.body;

  student
    .updateMany({ age: age }, { $set: { dept } })
    .then((data) => {
      console.log(data);
      res.status(200).json({ message: "student updated successfully" });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});
// delete data
app.delete("/student", (req, res, next) => {
  const { dept } = req.query;
  student
    .deleteMany({ dept })
    .then(() => res.status(200).json({ message: "student delete succfully" }))
    .catch((error) => res.status(500).json({ message: error.message }));
});
const errorMiddleware = (error, req, res, next) => {
  res.status(500).send(error.message);
};

app.use(errorMiddleware);

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
