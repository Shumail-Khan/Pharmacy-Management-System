const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());


// Routes
app.use("/", (req, res) => {
    res.send("Welcome to the Healthcare Management System API");
});
app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/patients", require("./routes/patientRoutes"));

module.exports = app;