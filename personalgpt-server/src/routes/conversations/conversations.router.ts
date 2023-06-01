import express from "express"
import { DeleteConversationController, GetAllConversationsController, GetConversationByIdController, PatchConversation, PostConversation } from "../../controllers/conversation.controller";
import { initExpressCallback } from "../../express/express-callback";

export const initGetAllConversationsRouter = (
  getAllConversations = initExpressCallback(new GetAllConversationsController())
) => {
  const router = express.Router();

  router.get("/", getAllConversations);

  return router;
};

export const initGetConversationByIdRouter = (
  getConversationById = initExpressCallback(new GetConversationByIdController())
) => {
  const router = express.Router();

  router.get("/:id", getConversationById);

  return router;
}

export const initPostConversationRouter = (
  postConversation = initExpressCallback(new PostConversation())
) => {
  const router = express.Router();

  router.post("/", postConversation);

  return router;
};

export const initPatchConversationRouter = (
  patchConversation = initExpressCallback(new PatchConversation())
) => {
  const router = express.Router();

  router.patch("/", patchConversation);

  return router;
};

export const initDeleteConversationRouter = (
  deleteConversation = initExpressCallback(new DeleteConversationController())
) => {
  const router = express.Router();

  router.delete("/:id", deleteConversation);

  return router;
}

const router = express.Router();

router.use([
  initGetAllConversationsRouter(),
  initGetConversationByIdRouter(),
  initPostConversationRouter(),
  initPatchConversationRouter(),
  initDeleteConversationRouter(),
]);

export default router;
