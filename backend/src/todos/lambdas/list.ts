import 'source-map-support/register';
import { APIGatewayProxyResult, APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda';
import { createLogger } from "../../utils/logger";
import TodoService from '../service';
import logStatements from '../log-statements';
import { LambdaEventHandler } from '../../interfaces/lambda-custom-event-handler';
import { getUserId } from '../../utils/get-user-id';
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

export const listTodos: LambdaEventHandler = async (event: APIGatewayProxyEvent, service, logger, getUserId) => {
  try {
    const userId = getUserId(event);
    const todos = await service.findAll(userId);
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

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const logger = createLogger(logStatements.findAll.name);
    const service = new TodoService();
    return listTodos(event, service, logger, getUserId);
  }
);

handler
  .use(httpErrorHandler())
  .use(cors({
    credentials: true
  }))
