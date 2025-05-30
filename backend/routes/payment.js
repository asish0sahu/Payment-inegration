import express from 'express';
import Razorpay from 'razorpay';
import 'dotenv/config.js';
import crypto from 'crypto';
import Payment from '../models/Payment.js';

const router = express.Router();

const razorpayInstance =new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

//Route1 for order

router.post('/order', (req, res) => {
    const { amount } = req.body;

    try {
        const options = {
            amount: Number(amount * 100),
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"),
        }

        razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Something Went Wrong!" });
            }
            res.status(200).json({ data: order });
            console.log(order)
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!" });
        console.log(error);
    }
})

//Route2 for payment verification
router.post('/verify', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    try {
        const sign = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        const isAuthentic = expectedSign === razorpay_signature;

        if (isAuthentic) {
            const payment = new Payment({
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature
            });

            await payment.save();

            res.json({ message: "Payment Successfully Verified" });
        } else {
            res.status(400).json({ message: "Payment Verification Failed" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!" });
        console.error(error);
    }
});





//route1
// router.get('/get-payment', (req,res)=>{
//     res.json("Payment Details")
// })

export default router;