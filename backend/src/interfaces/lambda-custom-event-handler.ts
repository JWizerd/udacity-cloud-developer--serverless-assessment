import { APIGatewayProxyEvent } from "aws-lambda";
import { Logger } from "winston";
import { Service } from "./service";

export type LambdaEventHandler<TEvent = any, TService = Service, TLogger = Logger, TResult = any> = (
  event: TEvent,
  service: TService,
  logger: TLogger,
  getUserIdFn?: (event: APIGatewayProxyEvent) => string
) => void | Promise<TResult>;