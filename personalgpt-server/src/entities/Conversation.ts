import { randomUUID } from "crypto";
import { BaseEntity } from "./BaseEntity";

export enum ChatCompletionRole {
  SYSTEM = "system",
  USER = "user",
  ASSISTANT = "assistant",
}

export interface ChatCompletionMessage {
  role: ChatCompletionRole;
  content: string;
  name?: string;
}

export interface Conversation extends BaseEntity {
  title: string;
  messages: ChatCompletionMessage[];
}

export type ConversationPreview = Omit<Conversation, "messages">;

export const createNewConversation = ({
  title = "New Conversation",
  messages = [],
}: Partial<Conversation>): Readonly<Conversation> =>
  Object.freeze({
    id: randomUUID(),
    createdAt: Date.now(),
    title,
    messages,
  });
