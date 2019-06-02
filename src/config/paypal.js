const paypal = require("paypal-rest-sdk");

const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const SECRET = process.env.PAYPAL_SECRET;

console.log("CLIENT_ID", CLIENT_ID);
console.log("SECRET", SECRET);

paypal.configure({
    mode: "sandbox", //sandbox or live
    client_id: CLIENT_ID,
    client_secret: SECRET
});

module.exports = paypal;
