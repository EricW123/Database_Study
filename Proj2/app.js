var path = require("path");

const express = require("express");

const router = require("./router/router.js");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static("public"));


app.use(router);


app.listen(3000, () => {
	console.log("http://localhost:3000");
});
