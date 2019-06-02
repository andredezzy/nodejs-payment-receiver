const service = require("./service");

class PayPalController {
    async index(req, res) {
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
            const transactionType = body.txn_type;
            response = await service.extract(transactionType);

            return res.status(response.status).json(response);
        } catch (e) {
            console.error(e);
        }
    }

    async store(req, res) {
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

        await service.createPayment(items, description);

        return res.send("test");
    }
}

module.exports = new PayPalController();
