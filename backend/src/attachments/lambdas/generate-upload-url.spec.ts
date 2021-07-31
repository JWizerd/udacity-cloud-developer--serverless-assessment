import { createLogger } from "../../utils/logger";
import { generateUploadUrl } from "./generate-upload-url";
import logStatements from "../log-statements";
import { AttachmentsRepositoryMock } from "../__mocks__/attachments-repository";
import APIGatewayProxyEventMock from "../__mocks__/api-gateway-event";

const logger = createLogger("test");
const repository = new AttachmentsRepositoryMock();
const mockAttachmentUrl = "http://link-to-attachment.com";

let logInfoSpy;
let logErrSpy;

describe('updateTodo', () => {
  beforeEach(() => {
    logInfoSpy = jest.spyOn(logger, "info").mockImplementation();
    logErrSpy = jest.spyOn(logger, "error").mockImplementation();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return status code 200 with attachment url', async () => {
    repository.getUploadUrl.mockResolvedValueOnce(mockAttachmentUrl);
    const response = await generateUploadUrl(APIGatewayProxyEventMock, repository, logger);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(JSON.stringify({ uploadUrl: mockAttachmentUrl }));
  });

  it('should call logger.info with correct params', async () => {
    repository.getUploadUrl.mockResolvedValueOnce(mockAttachmentUrl);
    await generateUploadUrl(APIGatewayProxyEventMock, repository, logger);
    expect(logInfoSpy).toBeCalledTimes(1);
    expect(logInfoSpy).toBeCalledWith(logStatements.generateUploadUrl.success, mockAttachmentUrl);
  });

  it('should return status code 500 with error message', async () => {
    repository.getUploadUrl.mockRejectedValueOnce("error");
    const response = await generateUploadUrl(APIGatewayProxyEventMock, repository, logger);
    expect(response.statusCode).toBe(500);
    expect(response.body).toBe(logStatements.generateUploadUrl.error);
  });

  it('should call logger.error with correct params', async () => {
    repository.getUploadUrl.mockRejectedValueOnce("error");
    await generateUploadUrl(APIGatewayProxyEventMock, repository, logger);
    expect(logErrSpy).toBeCalledTimes(1);
    expect(logErrSpy).toBeCalledWith(logStatements.generateUploadUrl.error, "error");
  });
});