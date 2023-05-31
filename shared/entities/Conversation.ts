import { Entity, Column, OneToMany, } from "typeorm";
import { ChatMessage } from "./Chat";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class Conversation extends BaseEntity {
  @Column()
  title: string;

  @OneToMany(() => ChatMessage, (message) => message.conversation)
  messages: ChatMessage[];
}
