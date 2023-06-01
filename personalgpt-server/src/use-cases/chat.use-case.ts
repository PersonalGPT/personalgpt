import { ChatCompletionRole, Conversation } from "../entities/Conversation";
import { ConversationRepository } from "../repositories/ConversationRepository";
import { InMemoryConversationRepository } from "../repositories/conversation.repository";
import { UseCase } from "./UseCase";

export class CreateChatCompletion implements UseCase<Conversation> {
  private _conversationRepo: ConversationRepository;

  constructor(conversationRepo = new InMemoryConversationRepository()) {
    this._conversationRepo = conversationRepo;
  }

  async execute(payload: Pick<Conversation, "id"> & { content: string }): Promise<Conversation> {
    const { id, content } = payload;

    if (!this._conversationRepo.exists(id))
      throw new Error(`Conversation with id '${id}' not found`);

    const conversation = await this._conversationRepo.getById(id);
    const messages = conversation.messages;
    let last = messages.length - 1;

    const lastMsg = messages[last];

    if (lastMsg.role === ChatCompletionRole.USER) {
      messages.push({ role: ChatCompletionRole.ASSISTANT, content: "" });
      last++;
    }

    messages[last] = {
      ...messages[last],
      content: messages[last].content + content,
    };

    return await this._conversationRepo.update(id, { messages });
  }
}
