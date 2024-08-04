const express = require("express");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const connectDB = require("./src/config/db");
const productRouter = require("./src/product/productRoutes");
const orderRouter = require('./src/order/orderRouter');
const categoryRouter = require('./src/category/categoryRoutes')
const userRouter = require("./src/user/userRoutes");
const authJwt = require("./src/helpers/jwt");
const erroHandler = require("./src/helpers/error-handler");


PORT = process.env.PORT_URI;

//middleware

app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(authJwt())
app.use(erroHandler)

app.use("/api", productRouter, orderRouter, categoryRouter, userRouter);

connectDB();

app.listen(PORT, () => {
  console.log(`listening on port http://localhost:${PORT}`);
});
