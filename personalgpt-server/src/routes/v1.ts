import express from "express";
import { chatRouter } from "./chat";
import { conversationsRouter } from "./conversations";

const router = express.Router();

router.use("/chat", chatRouter);
router.use("/conversations", conversationsRouter);

export default router;
