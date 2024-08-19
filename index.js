const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json()); // Add parentheses to express.json

const connectionUrl = "mongodb://127.0.0.1:27017/schoolDb";

mongoose
  .connect(connectionUrl)
  .then(() => console.log("Database connected"))
  .catch((error) => console.log(error));

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  dept: { type: String, required: true },
});

const Student = mongoose.model("Student", studentSchema);

// Add student
app.post("/student/single", async (req, res, next) => {
  try {
    const { name, email, age, dept } = req.body;
    const newStudent = new Student({
      name,
      email,
      age,
      dept,
    });
    await newStudent.save();
    res.status(200).json({ message: "Student added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// add multiple
app.post("/student/multiple", async (req, res, next) => {
  try {
    await Student.insertMany(req.body);
    res.status(200).json({ message: "student added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// update student
app.put("/student/single", async (req, res, next) => {
  const { email } = req.query;
  const { dept } = req.body;
  try {
    await Student.findOneAndUpdate({ email }, { dept });

    res.status(200).json({ messageg: "student updates successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// multiple doc
app.put("/student/multiple", async (req, res, next) => {
  const { dept } = req.query;
  const { age } = req.body;
  try {
    await Student.updateMany({ dept }, { age });
    res.status(200).json({ messageg: "student updated successfully" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});
const errorMiddleware = (error, req, res, next) => {
  res.status(500).send(error.message);
};

app.use(errorMiddleware);

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
