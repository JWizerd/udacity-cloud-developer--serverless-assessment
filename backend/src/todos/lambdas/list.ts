import 'source-map-support/register'
import { APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from "../../utils/logger";
import { findAllTodos } from '../service';

const logger = createLogger("list all todos");

export const handler: APIGatewayProxyHandler = async (): Promise<APIGatewayProxyResult> => {
  logger.info("listing all todos");

  const todos = await findAllTodos();

  return {
    statusCode: 200,
    body: JSON.stringify(todos)
  }
}
