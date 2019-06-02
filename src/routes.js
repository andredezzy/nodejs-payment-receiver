const express = require("express");

const routes = express.Router();

const PayPalController = require("./controllers/PayPal");

routes.get("/", (req, res) => res.send("/ -> OK!"));

routes.post("/ipn/paypal", PayPalController.index);
routes.post("/ipn/paypal/payment", PayPalController.store);

routes.post("/ipn/mercadopago", (req, res) => res.send("TODO"));

module.exports = routes;
