const express = require("express");
var cors = require('cors')
const app = express();

const {Secret_Key} = require("./src/secret.json");

const stripe = require("stripe")(Secret_Key);

app.use(express.json());
app.use(cors())

const calculateOrderAmount = (items) => {
  // Calculate the order total on the server to prevent people manipulating the cost on the client

  items.forEach(item => {
    console.log(item)
     // I'm not going to do the function for you...
  });

  return 1000;
};

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;

  const cost = calculateOrderAmount(items);

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: cost,
    currency: "gbp",
    automatic_payment_methods: {
      enabled: true,
    },
    
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
    cost
  });

});

app.post("/complete-payment-intent", async (req, res) => {
  const { payment_intent_id } = req.body;

  const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

  if (paymentIntent && paymentIntent.status === 'succeeded') {
    console.log("payment complete")
    res.send("paymen succeded")
  } else {
    console.log("payment failed")
    res.send("paymen failed")
  }

});

app.listen(4242, () => console.log("Node server listening on port 4242!"));