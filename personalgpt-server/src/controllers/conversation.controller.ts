import { ChatCompletionRole, } from "../entities/Conversation";
import { CreateConversation, DeleteConversationUseCase, GetAllConversationsUseCase, GetConversationByIdUseCase, UpdateConversation } from "../use-cases/conversation.use-case";
import { HTTPController, HTTPRequest, HTTPResponse, HTTPResponseStatus } from "./HTTPController";

export class GetAllConversationsController implements HTTPController {
  private _getAllConversations: GetAllConversationsUseCase;

  constructor(getAllConversations = new GetAllConversationsUseCase()) {
    this._getAllConversations = getAllConversations;
  }

  async processRequest(): Promise<HTTPResponse> {
    const conversations = await this._getAllConversations.execute();

    return {
      statusCode: HTTPResponseStatus.OK,
      body: conversations,
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
}

export class GetConversationByIdController implements HTTPController {
  private _getConversationById: GetConversationByIdUseCase;

  constructor(getConversationById = new GetConversationByIdUseCase()) {
    this._getConversationById = getConversationById;
  }

  async processRequest(request: Pick<HTTPRequest, "params">): Promise<HTTPResponse> {
    const { id } = request.params;

    try {
      const conversation = await this._getConversationById.execute(id);

      return {
        statusCode: HTTPResponseStatus.OK,
        body: conversation,
        headers: {
          "Content-Type": "application/json",
        },
      };
    }
    catch (err) {
      return {
        statusCode: HTTPResponseStatus.NotFound,
        body: {
          error: (err as Error).message,
        },
        headers: {
          "Content-Type": "application/json",
        },
      };
    }
  }
}

export class PostConversation implements HTTPController {
  private _createConversation: CreateConversation;

  constructor(createConversation = new CreateConversation()) {
    this._createConversation = createConversation;
  }

  async processRequest(request: Pick<HTTPRequest, "body">): Promise<HTTPResponse> {
    const { prompt } = request.body;
    const conversation = await this._createConversation.execute({
      title: prompt,
      messages: [
        { role: ChatCompletionRole.USER, content: prompt },
      ],
    });

    return {
      statusCode: HTTPResponseStatus.Created,
      body: conversation,
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
}

export class PatchConversation implements HTTPController {
  private _updateConversation: UpdateConversation;

  constructor(updateConversation = new UpdateConversation()) {
    this._updateConversation = updateConversation;
  }

  async processRequest(request: Pick<HTTPRequest, "body">): Promise<HTTPResponse> {
    const { id } = request.body;
    const replaced = await this._updateConversation.execute({ id, ...request.body });

    return {
      statusCode: HTTPResponseStatus.OK,
      body: replaced,
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
}

export class DeleteConversationController implements HTTPController {
  private _deleteConversation: DeleteConversationUseCase;

  constructor(deleteConversation = new DeleteConversationUseCase()) {
    this._deleteConversation = deleteConversation;
  }

  async processRequest(request: Pick<HTTPRequest, "params">): Promise<HTTPResponse> {
    const { id } = request.params;
    const existed = await this._deleteConversation.execute({ id });

    return {
      statusCode: HTTPResponseStatus.OK,
      body: existed,
      headers: {
        "Content-Type": "application/json",
      },
    }
  }
}
