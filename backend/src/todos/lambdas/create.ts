import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { CreateTodoRequest } from '../dtos/create';
import { createLogger } from "../../utils/logger";
import { Logger } from "winston";
import { createTodo } from "../service";
import logStatements from "./log-statements";

const logger: Logger = createLogger("todo-create");

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const newTodo: CreateTodoRequest = JSON.parse(event.body);
    const result = await createTodo(newTodo);
    logger.info(logStatements.create.success, newTodo);

    return {
      statusCode: 201,
      body: JSON.stringify(result)
    }
  } catch (error) {
    logger.crit(logStatements.create.error, error);

    return {
      statusCode: 500,
      body: logStatements.create.error
    }
  }
}
