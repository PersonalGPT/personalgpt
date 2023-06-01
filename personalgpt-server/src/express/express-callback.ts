// Based on Dev Mastery's comments API, express callback
// https://github.com/dev-mastery/comments-api/blob/master/src/express-callback/index.js

import { Request, Response } from "express";
import { HTTPController, HTTPRequest, HTTPResponse, HTTPResponseStatus } from "../controllers/HTTPController";

export const initExpressCallback = (controller: HTTPController) => {
  return async (req: Request, res: Response) => {
    // Convert Express request to framework-agnostic format
    const httpRequest: HTTPRequest = {
      body: req.body,
      query: req.query,
      params: req.params,
      method: req.method,
      path: req.path,
      headers: {
        "Content-Type": req.get("Content-Type"),
        Referer: req.get("Referer"),
        "User-Agent": req.get("User-Agent"),
      },
    };

    // Pass request data to HTTP controller for further processing
    await controller
      .processRequest(httpRequest, res)
      .then((httpResponse: HTTPResponse) => {
        // Prevent writing to ended stream
        if (!res.writable) return;

        // Send response back to client w/ proper headers, status code, and body payload
        // In our case, content type can be either application/json or text/event-stream
        if (httpResponse.headers) res.set(httpResponse.headers);
        res.status(httpResponse.statusCode).send(httpResponse.body);
      })
      .catch(() =>
        res.status(HTTPResponseStatus.ServerError).send({
          message: "Internal server error has occurred.",
        })
      );
  };
};
