import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { CreateTodoRequest } from '../dtos/create';
import { createLogger } from "../../utils/logger";
import TodoService from "../service";
import logStatements from "../log-statements";
import { LambdaEventHandler } from '../../interfaces/lambda-custom-event-handler';

const logger = createLogger(logStatements.create.name);
const service = new TodoService();

export const createTodo: LambdaEventHandler = async (event: APIGatewayProxyEvent, service, logger) => {
  try {
    const newTodo: CreateTodoRequest = JSON.parse(event.body);
    const result = await service.create(newTodo);
    logger.info(logStatements.create.success, newTodo);

    return {
      statusCode: 201,
      body: JSON.stringify(result)
    }
  } catch (error) {
    logger.error(logStatements.create.error, error);

    return {
      statusCode: 500,
      body: logStatements.create.error
    }
  }
}

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return createTodo(event, service, logger);
}

