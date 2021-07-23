import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { UpdateTodoRequest } from '../dtos/update';
import TodoService from "../service";
import logStatements from '../log-statements';
import { createLogger } from "../../utils/logger";

const logger = createLogger(logStatements.update.name);
const service = new TodoService();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const todoId = event.pathParameters.todoId;
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);
    const result = await service.updateTodo(todoId, updatedTodo);
    logger.info(logStatements.update.success);

    return {
      statusCode: 200,
      body: JSON.stringify(result)
    }
  } catch (error) {
    logger.crit(logStatements.update.error, error);

    return {
      statusCode: 500,
      body: logStatements.update.error
    }
  }
}
