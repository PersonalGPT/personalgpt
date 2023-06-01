import { OutgoingMessage } from "http";

export enum HTTPResponseStatus {
  OK = 200,
  Created = 201,
  Accepted = 202,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  ServerError = 500,
}

export type ResponseBody =
  string | object | boolean | Buffer | Array<any> | OutgoingMessage;

export type HTTPRequest = {
  body: {
    [key: string]: any;
  };
  query: {
    [key: string]: any;
  };
  params: {
    [key: string]: string;
  };
  method: string;
  path: string;
  headers: {
    [key: string]: any;
  };
};

export type HTTPResponse = {
  statusCode: HTTPResponseStatus;
  body: ResponseBody;
  headers: {
    [key: string]: any;
  };
};

export interface HTTPController {
  processRequest(
    request?: Partial<HTTPRequest>,
    responseHandler?: OutgoingMessage
  ): Promise<HTTPResponse>;
}
