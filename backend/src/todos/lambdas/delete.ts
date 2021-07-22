import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from "../../utils/logger";
import { deleteTodo } from "../service";

const logger = createLogger("delete todo");

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const todoId = event.pathParameters.todoId
    logger.info("Deleting todo: ", todoId);

    const deletedTodoId = await deleteTodo(todoId);

    return {
      statusCode: 204,
      body: deletedTodoId
    }
  } catch (error) {
    logger.crit(error);
  }
}
