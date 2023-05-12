import React, { useState, useEffect, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "./CheckoutForm";
import "./FrontEndPage.css";

import {Publishable_Key} from "./secret.json";

const stripePromise = loadStripe(Publishable_Key);

export default function FrontEndPage() {
    const isLoaded = useRef(false)
    const [clientSecret, setClientSecret] = useState(null);
    const [cost, setCost] = useState(0);

  useEffect(() => {
    // Extra check to make useEffect only happen once
    if (isLoaded.current === false){ 
        isLoaded.current = true;
        fetch("http://localhost:4242/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json", "cors":"*" },
            body: JSON.stringify({ items: [{ id: "AdultTicket", quantity:2 }] }),
          })
            .then((res) => res.json())
            .then((data) => {
              setClientSecret(data.clientSecret)
              setCost(data.cost)
            })
            .catch(err => console.log(err));
    }
    
  }, []);

  const appearance = {
    theme: 'stripe',
  };

  // UseState used here
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div>
      {
      clientSecret && (
        <>
        <h3>Please pay: £{cost/100}</h3>
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
        </>
      )
      }
    </div>
  );
}