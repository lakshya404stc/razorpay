const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");
const app = express();

app.use(cors());
app.use(express.json());

const instance = new Razorpay({
  key_id: "rzp_test_InsRygWKbskM3A",
  key_secret: "HEV5Hy7Fy2fqgkRVlCF88lQ6",
});

app.get("/checkout", (req, res) => {
  var options = {
    amount: 6000 * 100,
    currency: "INR",
  };

  instance.orders.create(options, function (err, order) {
    if (err) {
      console.log(err);
    } else {
      console.log(order);
      res.send({ amount: order.amount, order_id: order.id })
    }
  });
});

app.post("/pay-verify", (req, res) => {
  console.log(req.body);
  body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
  var crypto = require("crypto");
  var expectedSignature = crypto
    .createHmac("sha256", "HEV5Hy7Fy2fqgkRVlCF88lQ6")
    .update(body.toString())
    .digest("hex");
  console.log("sig" + req.body.razorpay_signature);
  console.log("sig" + expectedSignature);

  if (expectedSignature === req.body.razorpay_signature) {
    console.log("Payment Success");
  } else {
    console.log("Payment Fail");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
