import 'source-map-support/register'
import { DynamoDBStreamEvent, DynamoDBStreamHandler } from "aws-lambda";
import { LambdaEventHandler } from "../../interfaces/lambda-custom-event-handler";
import logStatements from "../log-statements";
import { TodoAttachmentService } from "../../todo-attachments/service";
import { createLogger } from "../../utils/logger";

export const removeAttachment: LambdaEventHandler = async (event: DynamoDBStreamEvent, service, logger) => {
  try {
    for (const record of event.Records) {
      if (record.eventName !== 'REMOVE') {
        continue
      }

      const todo = record.dynamodb.OldImage
      const todoId = todo.todoId.S;
      await service.delete(todoId);
      logger.info(logStatements.removeAttachment.success, todo);
    }
  } catch (error) {
    logger.error(logStatements.removeAttachment.error, error);
  }
}

export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
  const service = new TodoAttachmentService();
  const logger = createLogger(logStatements.removeAttachment.name);
  removeAttachment(event, service, logger);
}
