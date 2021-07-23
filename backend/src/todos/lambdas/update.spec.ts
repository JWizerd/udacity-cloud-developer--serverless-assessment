import { TodoServiceMock, TodoMock, APIGatewayProxyEventMock } from "../__mocks__";
import { createLogger } from "../../utils/logger";
import { updateTodo } from "./update";
import logStatements from "../log-statements";

const Logger = createLogger("test");
let logInfoSpy;
let logErrSpy;
describe('updateTodo', () => {
  beforeEach(() => {
    logInfoSpy = jest.spyOn(Logger, "info").mockImplementation();
    logErrSpy = jest.spyOn(Logger, "error").mockImplementation();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call service.update and return status 200 with updated object', async () => {
    TodoServiceMock.update.mockResolvedValueOnce(TodoMock);
    const result = await updateTodo(APIGatewayProxyEventMock, TodoServiceMock, Logger);
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(JSON.stringify(TodoMock));
  });

  it('should call service.update with the correct params', async () => {
    TodoServiceMock.update.mockResolvedValueOnce(TodoMock);
    await updateTodo(APIGatewayProxyEventMock, TodoServiceMock, Logger);
    expect(TodoServiceMock.update).toHaveBeenCalledTimes(1);
    expect(TodoServiceMock.update).toHaveBeenCalledWith(APIGatewayProxyEventMock.pathParameters.todoId, TodoMock);
  });

  it('should call logger.info with proper params', async () => {
    TodoServiceMock.update.mockResolvedValueOnce(TodoMock);
    await updateTodo(APIGatewayProxyEventMock, TodoServiceMock, Logger);
    expect(logInfoSpy).toHaveBeenCalledTimes(1);
    expect(logInfoSpy).toHaveBeenCalledWith(logStatements.update.success, TodoMock);
  });

  it('should call logger.error if error is thrown', async () => {
    TodoServiceMock.update.mockRejectedValue("error");
    await updateTodo(APIGatewayProxyEventMock, TodoServiceMock, Logger);
    expect(logErrSpy).toHaveBeenCalledTimes(1);
    expect(logErrSpy).toHaveBeenCalledWith(logStatements.update.error, "error");
  });

  it('should return a response object with status code 500 and the error message', async () => {
    TodoServiceMock.update.mockRejectedValue("error");
    const result = await updateTodo(APIGatewayProxyEventMock, TodoServiceMock, Logger);
    expect(result.statusCode).toBe(500);
    expect(result.body).toBe(logStatements.update.error);
  });
});