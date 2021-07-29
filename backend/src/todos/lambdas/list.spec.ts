import { TodoServiceMock, APIGatewayProxyEventCollectionMock  } from "../__mocks__";
import { createLogger } from "../../utils/logger";
import { listTodos } from "./list";
import logStatements from "../log-statements";

const Logger = createLogger("test");
let logInfoSpy;
let logErrSpy;
let getUserIdMock;

describe('listTodos', () => {
  beforeEach(() => {
    logInfoSpy = jest.spyOn(Logger, "info").mockImplementation();
    logErrSpy = jest.spyOn(Logger, "error").mockImplementation();
    getUserIdMock = jest.fn().mockImplementation(() => "abc123");
  });

  afterEach(() => {
    jest.resetAllMocks();
  })

  it('should return status code 200 with a collection of Todo Items', async () => {
    TodoServiceMock.findAll.mockResolvedValue(APIGatewayProxyEventCollectionMock.body);
    const result = await listTodos(APIGatewayProxyEventCollectionMock, TodoServiceMock, Logger, getUserIdMock);
    expect(result.statusCode).toBe(200);
    expect(result.body).toBe(JSON.stringify(APIGatewayProxyEventCollectionMock.body));
  });

  it('should call logger.info with correct params', async () => {
    await listTodos(APIGatewayProxyEventCollectionMock, TodoServiceMock, Logger, getUserIdMock);
    expect(logInfoSpy).toBeCalledTimes(1);
    expect(logInfoSpy).toBeCalledWith(logStatements.findAll.success, APIGatewayProxyEventCollectionMock);
  });

  it('should call logger.error with correct params', async () => {
    TodoServiceMock.findAll.mockRejectedValueOnce("error");
    await listTodos(APIGatewayProxyEventCollectionMock, TodoServiceMock, Logger, getUserIdMock);
    expect(logErrSpy).toBeCalledTimes(1);
    expect(logErrSpy).toBeCalledWith(logStatements.findAll.error, "error");
  });

  it('should respond with status code 500 and an error object', async () => {
    TodoServiceMock.findAll.mockRejectedValueOnce("error");
    const result = await listTodos(APIGatewayProxyEventCollectionMock, TodoServiceMock, Logger, getUserIdMock);
    expect(result.statusCode).toBe(500);
    expect(result.body).toBe(logStatements.findAll.error);
  });
});