import { Conversation, ConversationPreview, createNewConversation } from "../entities/Conversation";
import { ConversationRepository } from "./ConversationRepository";

const db = new Map<string, Conversation>();

export class InMemoryConversationRepository implements ConversationRepository {
  async getAll(): Promise<ConversationPreview[]> {
    const conversations = Array.from(db.values()).sort((a, b) => b.createdAt - a.createdAt);
    const previews: ConversationPreview[] = conversations.map(convo => ({
      id: convo.id,
      createdAt: convo.createdAt,
      title: convo.title,
    }));

    return previews;
  }

  async getById(id: string): Promise<Conversation> {
    const conversation = db.get(id);

    if (!conversation)
      throw new Error(`Conversation with id '${id}' not found in database!`);

    return conversation;
  }

  async exists(id: string): Promise<boolean> {
    return db.has(id);
  }

  async insert(item: Conversation): Promise<boolean> {
    try {
      db.set(item.id, item);
      return true;
    }
    catch (err) {
      console.error(err);
      return false;
    }
  }

  async update(id: string, replacement: Partial<Conversation>): Promise<Conversation> {
    // If conversation exists, replace contents
    if (db.has(id)) {
      const conversation = db.get(id) as Conversation;
      const updated: Conversation = {
        ...conversation,
        title: replacement.title || conversation.title,
        messages: replacement.messages || conversation.messages,
      };

      db.set(conversation.id, updated);
      return updated;
    }
    // Otherwise, create a new project with contents
    else {
      const conversation = createNewConversation(replacement);

      db.set(conversation.id, conversation);
      return conversation;
    }
  }

  async delete(id: string): Promise<boolean> {
    return db.delete(id);
  }
}
