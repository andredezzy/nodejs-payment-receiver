const service = require("./service");

class PayPalController {
    async notify(req, res) {
        // Send 200 status back to PayPal
        res.status(200).send("OK!");
        res.end();

        const body = req.body || {};
        console.log(body);

        // Validate IPN message with PayPal
        try {
            const isValidated = await service.validate(body);

            var response = {};

            if (!isValidated) {
                response = {
                    status: 401,
                    message: "Error validating IPN message"
                };

                console.error(response);

                return res.status(response.status).json(response);
            }

            // IPN Message is validated!
            response = await service.extract(body);

            return res.status(response.status).json(response);
        } catch (e) {
            console.error(e);
        }
    }

    async create(req, res) {
        const { items, description } = req.body;

        /*
            items: [
                {
                    name: "item",
                    sku: "item",
                    price: "1.00",
                    currency: "BRL",
                    quantity: 1
                }
            ],
            description: "Just a test payment"
        */

        const payment = await service.payment(items, description);

        return res.send(payment);
    }

    async get(req, res) {
        const { paymentId } = req.query;

        return service
            .get(paymentId)
            .then(payment => res.status(payment.httpStatusCode).send(payment))
            .catch(error => res.status(error.httpStatusCode).send(error));
    }
}

module.exports = new PayPalController();
