import 'source-map-support/register';
import { APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { createLogger } from "../../utils/logger";
import TodoService from '../service';
import logStatements from './log-statements';
const logger = createLogger(logStatements.findAll.name);

export const handler: APIGatewayProxyHandler = async (): Promise<APIGatewayProxyResult> => {
  try {
    const todos = await TodoService.findAllTodos();
    logger.info(logStatements.findAll.success);

    return {
      statusCode: 200,
      body: JSON.stringify(todos)
    }
  } catch (error) {
    logger.crit(logStatements.findAll.error, error);

    return {
      statusCode: 500,
      body: logStatements.findAll.error
    }
  }
}
