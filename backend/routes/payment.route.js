
import express from "express";
const paymentRouter = express.Router();
import { createOrder } from "../controllers/payment.controller.js";
paymentRouter.post("/create-order", createOrder);

export default paymentRouter;