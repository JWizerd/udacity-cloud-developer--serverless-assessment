import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { UpdateTodoRequest } from '../dtos/update';
import TodoRepository from "../todo-repository";
import logStatements from '../log-statements';
import { createLogger } from "../../utils/logger";
import { LambdaEventHandler } from '../../types/lambda-custom-event-handler';
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

export const updateTodo: LambdaEventHandler = async (event: APIGatewayProxyEvent, repository, logger) => {
  try {
    const todoId = event.pathParameters.todoId;
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);
    const result = await repository.update(todoId, updatedTodo);
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

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const logger = createLogger(logStatements.update.name);
    const repository = new TodoRepository();
    return updateTodo(event, repository, logger);
  }
);

handler
  .use(httpErrorHandler())
  .use(cors({
    credentials: true
  }))
