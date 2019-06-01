const express = require("express");
const bodyParser = require("body-parser");

const routes = require("./routes");

class App {
    constructor() {
        this.app = express();
        this.bodyParser = bodyParser;

        this.isDev = process.env.NODE_ENV !== "production";

        this.middlewares();
        this.routes();
    }

    middlewares() {
        // Parse application/x-www-form-urlencoded
        this.app.use(this.bodyParser.urlencoded({ extended: false }));

        // Parse application/json
        this.app.use(express.json());
        this.app.use(this.bodyParser.json());
        this.app.use(express.urlencoded({ extended: false }));
    }

    routes() {
        this.app.use(routes);
    }
}

module.exports = new App().app;
