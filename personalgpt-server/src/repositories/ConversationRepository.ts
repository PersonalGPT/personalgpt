import { Repository } from "./Repository";
import { Conversation, ConversationPreview } from "../entities/Conversation";

export type ConversationRepository = Repository<Conversation, ConversationPreview>;
