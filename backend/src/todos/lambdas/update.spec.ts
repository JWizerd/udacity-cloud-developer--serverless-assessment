import { TodoRepositoryMock, TodoMock, APIGatewayProxyEventMock } from "../__mocks__";
import { createLogger } from "../../utils/logger";
import { updateTodo } from "./update";
import logStatements from "../log-statements";

const Logger = createLogger("test");
let logInfoSpy;
let logErrSpy;
let getUserIdMock;
describe('updateTodo', () => {
  beforeEach(() => {
    logInfoSpy = jest.spyOn(Logger, "info").mockImplementation();
    logErrSpy = jest.spyOn(Logger, "error").mockImplementation();
    getUserIdMock = jest.fn().mockReturnValue("abc123");
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call repository.update and return status 200 with updated object', async () => {
    TodoRepositoryMock.update.mockResolvedValueOnce(TodoMock);
    const result = await updateTodo(APIGatewayProxyEventMock, TodoRepositoryMock, Logger, getUserIdMock);
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(JSON.stringify(TodoMock));
  });

  it('should call repository.update with the correct params', async () => {
    TodoRepositoryMock.update.mockResolvedValueOnce(TodoMock);
    await updateTodo(APIGatewayProxyEventMock, TodoRepositoryMock, Logger, getUserIdMock);
    expect(TodoRepositoryMock.update).toHaveBeenCalledTimes(1);
    expect(TodoRepositoryMock.update).toHaveBeenCalledWith(APIGatewayProxyEventMock.pathParameters.todoId, TodoMock, "abc123");
  });

  it('should call logger.info with proper params', async () => {
    TodoRepositoryMock.update.mockResolvedValueOnce(TodoMock);
    await updateTodo(APIGatewayProxyEventMock, TodoRepositoryMock, Logger, getUserIdMock);
    expect(logInfoSpy).toHaveBeenCalledTimes(1);
    expect(logInfoSpy).toHaveBeenCalledWith(logStatements.update.success, TodoMock);
  });

  it('should call logger.error if error is thrown', async () => {
    TodoRepositoryMock.update.mockRejectedValue("error");
    await updateTodo(APIGatewayProxyEventMock, TodoRepositoryMock, Logger, getUserIdMock);
    expect(logErrSpy).toHaveBeenCalledTimes(1);
    expect(logErrSpy).toHaveBeenCalledWith(logStatements.update.error, "error");
  });

  it('should return a response object with status code 500 and the error message', async () => {
    TodoRepositoryMock.update.mockRejectedValue("error");
    const result = await updateTodo(APIGatewayProxyEventMock, TodoRepositoryMock, Logger, getUserIdMock);
    expect(result.statusCode).toBe(500);
    expect(result.body).toBe(logStatements.update.error);
  });
});