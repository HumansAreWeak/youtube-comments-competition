const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const PORT = 3000;
const publicPath = path.join(__dirname, "public");

const app = express();
app.set("port", PORT);
app.set("host", "localhost");
app.set("view engine", "ejs");
app.use(express.static(publicPath));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

module.exports.router = app;

require("./router");

app.listen(PORT, () => {
    console.log(`Server is running http://localhost:${PORT}/`);
});
