const express = require("express");

const routes = express.Router();

const PayPalController = require("./controllers/PayPal");

routes.get("/", (req, res) => res.send("/ -> OK!"));
routes.get("/canceled-order", (req, res) =>
    res.send("You have been canceled your order. Token: " + req.query.token)
);

routes.post("/paypal/ipn", PayPalController.notify);

routes.get("/paypal/payment", PayPalController.get);
routes.post("/paypal/payment", PayPalController.create);

module.exports = routes;
