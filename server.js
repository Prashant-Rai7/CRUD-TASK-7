const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')
require("./server/db/mongoose");
const userRouter = require("./server/routers/user");
const path = require('path');
const hbs = require('hbs');
const app = express();

const publicPath = path.join(__dirname, "/public");
const viewsPath = path.join(__dirname, "/templates/views");
const partialsPath = path.join(__dirname, "/templates/partials");

const port = process.env.PORT || 3005;

app.use(express.static(publicPath));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cors())
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
app.use(userRouter);

app.set("view engine", "hbs");
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);



app.listen(port, () => {
  console.log(`Listing on http://localhost:${port}`)
  console.log(`Listing on http://127.0.0.1:${port}`)
})