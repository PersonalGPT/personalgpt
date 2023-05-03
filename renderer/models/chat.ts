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
