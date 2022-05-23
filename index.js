// Import routes
const express = require("express");
const logger = require("morgan");
//Require the connect async function towards the database
const {connectDB} = require("./app/config/database");
//Import routing files
const users = require("./app/api/routes/user.routes");
const messages = require("./app/api/routes/message.routes");

const HTTPSTATUSCODE = require("./app/utils/httpStatusCode");
const cors = require("cors");


const PORT = 3001;

connectDB();

const app = express();


//Config app
app.set("secretKey", "nodeRestApi"); // jwt secret token

//Headers for responses
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

//Cors for React frontend client
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger("dev"));

// routes
app.use("/users", users);
app.use("/messages", messages);

app.use('/', (req, res) => {
  res.send('Hola Alfonsete');
});

//for routes undefined
app.use((req, res, next) => {
  let err = new Error();
  err.status = 404;
  err.message = HTTPSTATUSCODE[404];
  next(err);
});

// handle errors
app.use((err, req, res, next) => {
  return res.status(err.status || 500).json(err.message || 'Unexpected error on server');
})

app.disable('x-powered-by');

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:3001/`)
});

