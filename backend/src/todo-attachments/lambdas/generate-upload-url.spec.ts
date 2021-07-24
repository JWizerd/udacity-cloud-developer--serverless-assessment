import { createLogger } from "../../utils/logger";
import { generateUploadUrl } from "./generate-upload-url";
import logStatements from "../log-statements";
import { TodoAttachmentsServiceMock } from "../__mocks__/service";
import APIGatewayProxyEventMock from "../__mocks__/api-gateway-event";

const logger = createLogger("test");
const service = new TodoAttachmentsServiceMock();
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
    service.getUploadUrl.mockResolvedValueOnce(mockAttachmentUrl);
    const response = await generateUploadUrl(APIGatewayProxyEventMock, service, logger);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(mockAttachmentUrl);
  });

  it('should call logger.info with correct params', async () => {
    service.getUploadUrl.mockResolvedValueOnce(mockAttachmentUrl);
    await generateUploadUrl(APIGatewayProxyEventMock, service, logger);
    expect(logInfoSpy).toBeCalledTimes(1);
    expect(logInfoSpy).toBeCalledWith(logStatements.generateUploadUrl.success, mockAttachmentUrl);
  });

  it('should return status code 500 with error message', async () => {
    service.getUploadUrl.mockRejectedValueOnce("error");
    const response = await generateUploadUrl(APIGatewayProxyEventMock, service, logger);
    expect(response.statusCode).toBe(500);
    expect(response.body).toBe(logStatements.generateUploadUrl.error);
  });

  it('should call logger.error with correct params', async () => {
    service.getUploadUrl.mockRejectedValueOnce("error");
    await generateUploadUrl(APIGatewayProxyEventMock, service, logger);
    expect(logErrSpy).toBeCalledTimes(1);
    expect(logErrSpy).toBeCalledWith(logStatements.generateUploadUrl.error, "error");
  });
});