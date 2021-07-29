import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { UpdateTodoRequest } from '../dtos/update';
import TodoService from "../service";
import logStatements from '../log-statements';
import { createLogger } from "../../utils/logger";
import { LambdaEventHandler } from '../../interfaces/lambda-custom-event-handler';

export const updateTodo: LambdaEventHandler = async (event: APIGatewayProxyEvent, service, logger) => {
  try {
    const todoId = event.pathParameters.todoId;
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);
    const result = await service.update(todoId, updatedTodo);
    logger.info(logStatements.update.success, result);

    return {
      statusCode: 200,
      body: JSON.stringify(result)
    }
  } catch (error) {
    logger.error(logStatements.update.error, error);

    return {
      statusCode: 500,
      body: logStatements.update.error
    }
  }
}

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const logger = createLogger(logStatements.update.name);
  const service = new TodoService();
  return updateTodo(event, service, logger);
}
