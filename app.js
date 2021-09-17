//   https://www.freecodecamp.org/news/simple-chat-application-in-node-js-using-express-mongoose-and-socket-io-ee62d94f5804/
//   https://stackoverflow.com/questions/38306569/what-does-body-parser-do-with-express
//   https://stackoverflow.com/questions/26417297/what-do-nodes-body-parser-and-cookie-parser-do-and-should-i-use-them
require("dotenv").config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
// Routes
const authRoutes = require("./routes/auth.js");
const userRoutes = require("./routes/user.js");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
// const stripeRoutes = require("./routes/stripePayment");
const paymentBRoutes = require("./routes/payment");

mongoose.connect( process.env.DATABASE , {
useNewUrlParser: true,
useUnifiedTopology:true, 
useCreateIndex:true } )
.then(() => {
    console.log("DB CONNECTED");
});

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// My Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
// app.use("/api", stripeRoutes);
app.use("/api", paymentBRoutes);

// PORT
var port = 8000;

// Link to DB
app.listen(port ,() => {
    console.log(`app is running at ${port}`);
});










