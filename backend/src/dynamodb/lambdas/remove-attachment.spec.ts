import { TodoEventStream, AttachmentsRepositoryMock } from "../__mocks__";
import { createLogger } from "../../utils/logger";
import { removeAttachment } from "./remove-attachment";
import logStatements from "../log-statements";

let logInfoSpy;
let logErrSpy;
const Logger = createLogger("test");

describe('removeAttachment', () => {
  beforeEach(() => {
    logInfoSpy = jest.spyOn(Logger, "info").mockImplementation();
    logErrSpy = jest.spyOn(Logger, "error").mockImplementation();
  });

  afterEach(() => {
    jest.resetAllMocks();
  })

  it('should call repository.delete once with correct params', async () => {
    await removeAttachment(TodoEventStream, AttachmentsRepositoryMock, Logger);
    expect(AttachmentsRepositoryMock.delete).toHaveBeenCalledTimes(1);
    expect(AttachmentsRepositoryMock.delete).toHaveBeenCalledWith(TodoEventStream.Records[0].dynamodb.OldImage.todoId.S);
  });

  it('should call logger.info once with correct params', async () => {
    await removeAttachment(TodoEventStream, AttachmentsRepositoryMock, Logger);
    expect(logInfoSpy).toHaveBeenCalledTimes(1);
    expect(logInfoSpy).toHaveBeenCalledWith(logStatements.removeAttachment.success, TodoEventStream);
  });

  it('should call logger.error once with correct params', async () => {
    AttachmentsRepositoryMock.delete.mockRejectedValue("error");
    await removeAttachment(TodoEventStream, AttachmentsRepositoryMock, Logger);
    expect(logErrSpy).toHaveBeenCalledTimes(1);
    expect(logErrSpy).toHaveBeenCalledWith(logStatements.removeAttachment.error, "error");
  });
});