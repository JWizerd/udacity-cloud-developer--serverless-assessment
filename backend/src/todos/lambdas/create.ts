import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { CreateTodoRequest } from '../dtos/create';
import { createLogger } from "../../utils/logger";
import TodoService from "../service";
import logStatements from "../log-statements";
import { LambdaEventHandler } from '../../interfaces/lambda-custom-event-handler';
import { getUserId } from "../../utils/get-user-id";
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

export const createTodo: LambdaEventHandler = async (event: APIGatewayProxyEvent, service, logger, getUserId) => {
  try {
    const newTodo: CreateTodoRequest = JSON.parse(event.body);
    const userId = getUserId(event);
    const result = await service.create(newTodo, userId);
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

const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const logger = createLogger(logStatements.create.name);
    const service = new TodoService();
    return createTodo(event, service, logger, getUserId);
  }
);

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )

