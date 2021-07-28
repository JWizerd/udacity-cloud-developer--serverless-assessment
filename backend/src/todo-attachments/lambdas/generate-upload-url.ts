import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { LambdaEventHandler } from '../../interfaces/lambda-custom-event-handler'
import { TodoAttachmentService } from '../service'
import { createLogger } from "../../utils/logger";
import logStatements from '../log-statements';
import { AttachmentsService } from '../attachments-service.interface';

export const generateUploadUrl: LambdaEventHandler = async (
  event: APIGatewayProxyEvent,
  service: AttachmentsService,
  logger) => {
    try {
      const todoId = event.pathParameters.todoId;
      const url = await service.getUploadUrl(todoId);
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
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const service = new TodoAttachmentService();
  const logger = createLogger(logStatements.generateUploadUrl.name);
  return generateUploadUrl(event, service, logger);
}
