import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from "../../utils/logger";
import TodoService from "../service";
import logStatements from "./log-statements";

const logger = createLogger(logStatements.delete.name);

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const todoId = event.pathParameters.todoId
    const deletedTodoId = await TodoService.deleteTodo(todoId);
    logger.info(logStatements.delete.success, todoId);

    return {
      statusCode: 204,
      body: deletedTodoId
    }
  } catch (error) {
    logger.crit(logStatements.delete.error ,error);
  }
}
