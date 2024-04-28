import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const CheckoutForm = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    const loadRazorpay = async () => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
            console.log('Razorpay SDK loaded.');
        };
        document.body.appendChild(script);
    };

    loadRazorpay();

}, []);


const handlePayment = async () => {
    try {
      const response = await axios.get("http://localhost:5000/checkout");
      const { amount, order_id } = response.data;
      setOrderId(order_id);
      
      const data = {
        amount: amount.toString(), 
        currency: "INR", 
        email: "gaurav.kumar@example.com",
        contact: "9123456780",
        notes: {
            address: "Ground Floor, SJR Cyber, Laskar Hosur Road, Bengaluru",
        },
        order_id: order_id, 
        method: "card",
        card: {
            number: cardNumber,
            name: name,
            expiry_month: expiry.split("/")[0],
            expiry_year: expiry.split("/")[1],
            cvv: cvv,
        },
    };
    
    var razorpay = new window.Razorpay({
      key: "rzp_test_InsRygWKbskM3A",
      image: 'https://i.imgur.com/n5tjHFD.jpg',
    });

    // razorpay.createPayment(data);
    razorpay.open(data)
    
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to create order");
    }
  };

  return (
    <>
      <div className="container p-0">
        <div className="card px-4">
          <input type="hidden" name="order_id" value={orderId} />
          <p className="h8 py-3">Payment Details</p>
          <div className="col-12">
            <div className="row gx-3">
              <div className="d-flex flex-column">
                <p className="text mb-1">Person Name</p>
                <input
                  className="form-control mb-3"
                  type="text"
                  placeholder="John MacClain"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <div className="col-12">
              <div className="d-flex flex-column">
                <p className="text mb-1">Card Number</p>
                <input
                  className="form-control mb-3"
                  type="text"
                  placeholder="1234 5678 435678"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </div>
            </div>
            <div className="col-6">
              <div className="d-flex flex-column">
                <p className="text mb-1">Expiry</p>
                <input
                  className="form-control mb-3"
                  type="text"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                />
              </div>
            </div>
            <div className="col-6">
              <div className="d-flex flex-column">
                <p className="text mb-1">CVV/CVC</p>
                <input
                  className="form-control mb-3 pt-2"
                  type="password"
                  placeholder="***"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                />
              </div>
            </div>
            <div className="col-12">
              <button className="btn btn-primary mb-3" onClick={handlePayment}>
                Pay Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutForm;
