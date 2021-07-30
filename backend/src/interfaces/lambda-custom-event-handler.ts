import { APIGatewayProxyEvent } from "aws-lambda";
import { Logger } from "winston";
import { Repository } from "./repository";

export type LambdaEventHandler<TEvent = any, TRepository = Repository, TLogger = Logger, TResult = any> = (
  event: TEvent,
  service: TRepository,
  logger: TLogger,
  getUserIdFn?: (event: APIGatewayProxyEvent) => string
) => void | Promise<TResult>;