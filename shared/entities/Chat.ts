import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { Conversation } from "./Conversation";
import { BaseEntity } from "./BaseEntity";

export enum ChatCompletionRole {
  SYSTEM = "system",
  USER = "user",
  ASSISTANT = "assistant",
}

export interface ChatCompletionMessage {
  role: ChatCompletionRole;
  content: string;
}

@Entity()
export class ChatMessage extends BaseEntity {
  @Column()
  content: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  @JoinColumn({ name: "conversationId" })
  conversation: Conversation;
}
