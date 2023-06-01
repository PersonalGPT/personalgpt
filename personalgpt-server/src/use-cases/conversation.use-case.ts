import { Conversation, ConversationPreview, createNewConversation } from "../entities/Conversation";
import { ConversationRepository } from "../repositories/ConversationRepository";
import { InMemoryConversationRepository } from "../repositories/conversation.repository";
import { UseCase } from "./UseCase";

export class GetAllConversationsUseCase implements UseCase<ConversationPreview[]> {
  private _conversationRepo: ConversationRepository;

  constructor(conversationRepo = new InMemoryConversationRepository()) {
    this._conversationRepo = conversationRepo;
  }

  async execute(): Promise<ConversationPreview[]> {
    return await this._conversationRepo.getAll();
  }
}

export class GetConversationByIdUseCase implements UseCase<Conversation> {
  private _conversationRepo: ConversationRepository;

  constructor(conversationRepo = new InMemoryConversationRepository()) {
    this._conversationRepo = conversationRepo;
  }

  async execute(payload: string): Promise<Conversation> {
    return await this._conversationRepo.getById(payload);
  }
}

export class CreateConversation implements UseCase<Conversation> {
  private _conversationRepo: ConversationRepository;

  constructor(conversationRepo = new InMemoryConversationRepository()) {
    this._conversationRepo = conversationRepo;
  }

  async execute(payload: Partial<Conversation>): Promise<Conversation> {
    const conversation = createNewConversation(payload);

    await this._conversationRepo.insert(conversation);
    return conversation;
  }
}

export class UpdateConversation implements UseCase<Conversation> {
  private _conversationRepo: ConversationRepository;

  constructor(conversationRepo = new InMemoryConversationRepository()) {
    this._conversationRepo = conversationRepo;
  }

  async execute(payload: Pick<Conversation, "id"> & Partial<Conversation>): Promise<Conversation> {
    return await this._conversationRepo.update(payload.id, payload);
  }
}

export class DeleteConversationUseCase implements UseCase<boolean> {
  private _conversationRepo: ConversationRepository;

  constructor(conversationRepo = new InMemoryConversationRepository()) {
    this._conversationRepo = conversationRepo;
  }

  async execute(payload: Pick<Conversation, "id">): Promise<boolean> {
    return await this._conversationRepo.delete(payload.id);
  }
}
