import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from "../../utils/logger";
import TodoService from "../service";
import logStatements from "../log-statements";
import { LambdaEventHandler } from '../../interfaces/lambda-custom-event-handler';

const logger = createLogger(logStatements.delete.name);
const service = new TodoService();

export const deleteTodo: LambdaEventHandler = async (event: APIGatewayProxyEvent, service, logger) => {
  try {
    const todoId = event.pathParameters.todoId
    await service.delete(todoId);
    logger.info(logStatements.delete.success, todoId);

    return {
      statusCode: 204,
      body: ""
    }
  } catch (error) {
    logger.error(logStatements.delete.error, error);

    return {
      statusCode: 500,
      body: logStatements.delete.error
    }
  }
}

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return deleteTodo(event, service, logger);
}
