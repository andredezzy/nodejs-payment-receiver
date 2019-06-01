const express = require("express");

const routes = express.Router();

const serviceMiddleware = require("./middlewares/service");

const IPNController = require("./controllers/IPNController");

routes.get("/", (req, res) => res.send("OK!"));

routes.post("/ipn/:service", serviceMiddleware, IPNController.index);

module.exports = routes;
