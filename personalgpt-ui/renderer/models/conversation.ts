import { BaseEntity } from "./base";
import { ChatCompletionMessage } from "./chat";

export interface Conversation extends BaseEntity {
  title: string;
  messages: ChatCompletionMessage[];
}

export type ConversationPreview = Omit<Conversation, "messages">;
