import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from "../../utils/logger";
import TodoRepository from "../todo-repository";
import logStatements from "../log-statements";
import { LambdaEventHandler } from '../../types/lambda-custom-event-handler';
import { getUserId } from "../../utils/get-user-id";
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

export const deleteTodo: LambdaEventHandler = async (event: APIGatewayProxyEvent, repository, logger, getUserId) => {
  try {
    const userId = getUserId(event);
    const todoId = event.pathParameters.todoId
    logger.info(logStatements.delete.success, todoId);
    await repository.delete(todoId, userId);

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
    const repository = new TodoRepository();
    return deleteTodo(event, repository, logger, getUserId);
  }
);

handler
  .use(httpErrorHandler())
  .use(cors({
  credentials: true
}));
