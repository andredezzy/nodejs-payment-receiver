const PayPalService = require("../services/PayPal");

module.exports = (req, res, next) => {
    const serviceParam = req.params.service;

    if (serviceParam.toLowerCase() === "paypal") {
        req.service = PayPalService;
    } else if (serviceParam.toLowerCase() === "another") {
        console.log("Another Service");
    } else {
        return res.status(404).json({
            error: { status: 404, message: "service param not found" }
        });
    }

    return next();
};
