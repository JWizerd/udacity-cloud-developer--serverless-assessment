import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from "../../utils/logger";
import TodoService from "../service";
import logStatements from "../log-statements";
import { LambdaEventHandler } from '../../interfaces/lambda-custom-event-handler';
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

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

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const logger = createLogger(logStatements.delete.name);
    const service = new TodoService();
    return deleteTodo(event, service, logger);
  }
);

handler
  .use(httpErrorHandler())
  .use(cors({
  credentials: true
}));
