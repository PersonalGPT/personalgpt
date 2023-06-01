import { IncomingMessage, OutgoingMessage } from "http";
import { HTTPController, HTTPRequest, HTTPResponse, HTTPResponseStatus } from "./HTTPController";
import { openai } from "../config/openai";
import { CreateChatCompletion } from "../use-cases/chat.use-case";

export class PostChatCompletion implements HTTPController {
  private _createChatCompletion: CreateChatCompletion;

  constructor(createChatCompletion = new CreateChatCompletion()) {
    this._createChatCompletion = createChatCompletion;
  }

  async processRequest(
    request: Pick<HTTPRequest, "body">,
    responseHandler: OutgoingMessage
  ): Promise<HTTPResponse> {
    const { id, messages } = request.body;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages,
      stream: true,
    }, {
      responseType: "stream",
    });

    const stream = completion.data as unknown as IncomingMessage;

    return new Promise((resolve, reject) => {
      let content = "";

      stream.on("data", async (chunk: Buffer) => {
        // Data stream chunks are delimited by \n\n
        const lines = chunk.toString().split("\n\n")
          .filter(line => line.length > 0 && !line.includes("[DONE]"));

        // Convert chunks to JSON and extract text content
        for (const line of lines) {
          const data = line.replace("data: ", "");
          const json = JSON.parse(data);

          const token = json.choices[0].delta.content;

          // Write data to response stream
          if (token) {
            content += token;
            responseHandler.write(token);
          }
        }
      });

      // Close the stream when all data is written
      stream.on("end", async () => {
        await this._createChatCompletion.execute({ id, content });
        responseHandler.end();
      });
      stream.on("error", err => {
        console.error(err);
        reject(err);
      });
    });
  }
}
