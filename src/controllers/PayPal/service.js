const request = require("request");

const { paypal } = require("../../config");

class PayPalService {
    validate(body = {}) {
        return new Promise((resolve, reject) => {
            // Prepend 'cmd=_notify-validate' flag to the post string
            let postreq = "cmd=_notify-validate";

            // Iterate the original request payload object
            // and prepend its keys and values to the post string
            Object.keys(body).map(key => {
                postreq = `${postreq}&${key}=${body[key]}`;
                return key;
            });

            const options = {
                url: "https://ipnpb.sandbox.paypal.com/cgi-bin/webscr",
                method: "POST",
                headers: {
                    "Content-Length": postreq.length
                },
                encoding: "utf-8",
                body: postreq
            };

            // Make a post request to PayPal
            request(options, (error, response, resBody) => {
                if (error || response.statusCode !== 200) {
                    reject(new Error(error));
                    return;
                }

                // Validate the response from PayPal and resolve / reject the promise.
                if (resBody.substring(0, 8) === "VERIFIED") {
                    resolve(true);
                } else if (resBody.substring(0, 7) === "INVALID") {
                    reject(new Error("IPN message is invalid"));
                } else {
                    reject(new Error("Unexpected response body"));
                }
            });
        });
    }

    extract(body) {
        const transactionType = body.txn_type;

        console.log("Transaction type: ", transactionType);

        var transactionInfo = {
            status: 200,
            type: transactionType,
            info: {}
        };

        switch (transactionType) {
            case "web_accept":
            case "cart":
            case "subscr_payment":
                const status = body.payment_status;
                const amount = body.mc_gross;
                // Validate that the status is completed,
                // and the amount match your expectaions.
                break;
            case "subscr_signup":
            case "subscr_cancel":
            case "subscr_eot":
                // Update user profile
                break;
            case "recurring_payment_suspended":
            case "recurring_payment_suspended_due_to_max_failed_payment":
                // Contact the user for more details
                break;
            default:
                transactionInfo = {
                    ...transactionInfo,
                    status: 404,
                    info: {
                        status: 404,
                        message:
                            "Unhandled transaction type: " + transactionType
                    }
                };
        }

        return transactionInfo;
    }

    payment(items, description) {
        console.log("\nCreating payment...");

        return new Promise((resolve, reject) => {
            var paymentJson = {
                intent: "order",
                payer: {
                    payment_method: "paypal"
                },
                redirect_urls: {
                    return_url:
                        "https://nodejs-payment-receiver.herokuapp.com/paypal/payment",
                    cancel_url:
                        "https://nodejs-payment-receiver.herokuapp.com/canceled-order"
                },
                transactions: [
                    {
                        item_list: {
                            items
                        },
                        amount: {
                            currency: "BRL",
                            total: "1.00"
                        },
                        description
                    }
                ]
            };

            paypal.payment.create(paymentJson, function(error, payment) {
                if (error) {
                    reject(error);
                } else {
                    console.log("Payment ->", payment, "\n");

                    resolve(payment);
                }
            });
        });
    }

    async get(id) {
        console.log("\nGetting informations for payment id:", id + "...");

        return new Promise((resolve, reject) => {
            paypal.payment.get(id, function(error, payment) {
                if (error) {
                    reject(error);
                } else {
                    console.log("Info ->", payment, "\n");

                    resolve(payment);
                }
            });
        });
    }
}

module.exports = new PayPalService();
