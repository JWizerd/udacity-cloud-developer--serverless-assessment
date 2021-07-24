import 'source-map-support/register';
import { APIGatewayProxyResult, APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda';
import { createLogger } from "../../utils/logger";
import TodoService from '../service';
import logStatements from '../log-statements';
import { LambdaEventHandler } from '../../interfaces/lambda-custom-event-handler';

export const listTodos: LambdaEventHandler = async (event: APIGatewayProxyEvent, service, logger) => {
  try {
    const todos = await service.findAll();
    logger.info(logStatements.findAll.success, event);

    return {
      statusCode: 200,
      body: JSON.stringify(todos)
    }
  } catch (error) {
    logger.error(logStatements.findAll.error, error);

    return {
      statusCode: 500,
      body: logStatements.findAll.error
    }
  }
}

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const logger = createLogger(logStatements.findAll.name);
  const service = new TodoService();
  return listTodos(event, service, logger);
}
