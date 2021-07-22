import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { CreateTodoRequest } from '../dtos/create';
import { createLogger } from "../../utils/logger";
import { Logger } from "winston";
import { createTodo } from "../service";

const logger: Logger = createLogger("todo-create");

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const newTodo: CreateTodoRequest = JSON.parse(event.body);
    logger.info("Adding new todo: ", newTodo);
    const result = await createTodo(newTodo);
    return {
      statusCode: 201,
      body: JSON.stringify(result)
    }
  } catch (error) {
    logger.crit(error);
  }
}
