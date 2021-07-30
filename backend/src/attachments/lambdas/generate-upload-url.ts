import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { LambdaEventHandler } from '../../types/lambda-custom-event-handler'
import { createLogger } from "../../utils/logger";
import logStatements from '../log-statements';
import { AttachmentsRepository } from '../attachments-repository';
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

export const generateUploadUrl: LambdaEventHandler = async (
  event: APIGatewayProxyEvent,
  repository: AttachmentsRepository,
  logger) => {
    try {
      const todoId = event.pathParameters.todoId;
      const url = await repository.getUploadUrl(todoId);
      logger.info(logStatements.generateUploadUrl.success, url);

      return {
        statusCode: 200,
        body: url
      };
    } catch(error) {
      logger.error(logStatements.generateUploadUrl.error, error)

      return {
        statusCode: 500,
        body: logStatements.generateUploadUrl.error
      }
    }

}
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const repository = new AttachmentsRepository();
    const logger = createLogger(logStatements.generateUploadUrl.name);
    return generateUploadUrl(event, repository, logger);
  }
);

handler
  .use(httpErrorHandler())
  .use(cors({
    credentials: true
  }));
