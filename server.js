
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/StudentDB")
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => console.log("MongoDB connection error:", err));

// Student schema
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rollNo: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    branch: { type: String, required: true },
    year: { type: Number, required: true }
});

// Student model
const Student = mongoose.model("Student", studentSchema);

// Display the application form
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Store student data
app.post("/submit", async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();

        res.send(`
            <h2>Student Application Submitted Successfully!</h2>
            <a href="/">Go Back</a>
        `);
    } catch (err) {
        res.status(400).send(
            "Error saving student data: " + err.message +
            '<br><a href="/">Go Back</a>'
        );
    }
});

// Display all students as JSON
app.get("/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start server after database connection
mongoose.connection.once("open", () => {
    app.listen(3000, () => {
        console.log("Server running at http://localhost:3000");
    });
});
