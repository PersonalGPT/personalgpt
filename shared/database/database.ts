import { DataSource } from "typeorm";
import { Conversation } from "../entities/Conversation";
import { ChatMessage } from "../entities/Chat";

const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: true,
  entities: [Conversation, ChatMessage],
  migrations: [],
  subscribers: [],
});

export const initDataSource = () => {
  AppDataSource.initialize()
    .then(async () => {
      console.log("Data source initialized...");
      const conversation = new Conversation();
      conversation.title = "New Conversation";

      await AppDataSource.manager.save(conversation);
      console.log(`Saved new conversation ${conversation.id}`);

      const conversations = await AppDataSource.manager.find(Conversation);
      console.log(conversations);
    })
    .catch(err => {
      console.error(err);
    });
};
