import 'source-map-support/register'
import { DynamoDBStreamEvent, DynamoDBStreamHandler } from "aws-lambda";
import { LambdaEventHandler } from "../../types/lambda-custom-event-handler";
import logStatements from "../log-statements";
import { AttachmentsRepository } from "../../attachments/attachments-repository";
import { createLogger } from "../../utils/logger";

export const removeAttachment: LambdaEventHandler = async (event: DynamoDBStreamEvent, repository, logger) => {
  try {
    for (const record of event.Records) {
      if (record.eventName === 'REMOVE') {
        logger.info(logStatements.removeAttachment.success, event);
        await repository.delete(record.dynamodb.Keys.todoId.S);
      }
    }
  } catch (error) {
    logger.error(logStatements.removeAttachment.error, error);
  }
}

export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
  const repository = new AttachmentsRepository();
  const logger = createLogger(logStatements.removeAttachment.name);
  removeAttachment(event, repository, logger);
}
