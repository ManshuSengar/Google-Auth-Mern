const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const DbConnect = require("./database");

app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: "GET,POST,PUT,DELETE,OPTIONS",
    })
);
app.use(express.json());
DbConnect();
require('./routes')(app)


app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));