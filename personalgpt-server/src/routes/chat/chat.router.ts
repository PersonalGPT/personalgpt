import express from "express"
import { initExpressCallback } from "../../express/express-callback";
import { PostChatCompletion } from "../../controllers/chat.controller";

export const initPostChatCompletionRouter = (
  postChatCompletion = initExpressCallback(new PostChatCompletion())
) => {
  const router = express.Router();

  router.post("/", postChatCompletion);

  return router;
};

const router = express.Router();

router.use([
  initPostChatCompletionRouter(),
])

export default router;
