import { TodoServiceMock, APIGatewayProxyEventMock, TodoMock } from "../__mocks__";
import { createLogger } from "../../utils/logger";
import { createTodo } from "./create";
import logStatements from "../log-statements";

const Logger = createLogger("test");
let logInfoSpy;
let logErrSpy;
describe('createTodo', () => {
  beforeEach(() => {
    logInfoSpy = jest.spyOn(Logger, "info").mockImplementation();
    logErrSpy = jest.spyOn(Logger, "error").mockImplementation();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call service.create and return status 201 with newly created object', async () => {
    TodoServiceMock.create.mockResolvedValueOnce(TodoMock);
    const result = await createTodo(APIGatewayProxyEventMock, TodoServiceMock, Logger);
    expect(result.statusCode).toBe(201);
    expect(result.body).toEqual(JSON.stringify(TodoMock));
  });

  it('should call service.create with the correct params', async () => {
    TodoServiceMock.create.mockResolvedValueOnce(TodoMock);
    await createTodo(APIGatewayProxyEventMock, TodoServiceMock, Logger);
    expect(TodoServiceMock.create).toHaveBeenCalledTimes(1);
    expect(TodoServiceMock.create).toHaveBeenCalledWith(TodoMock);
  });

  it('should call logger.info with proper params', async () => {
    TodoServiceMock.create.mockResolvedValueOnce(TodoMock);
    await createTodo(APIGatewayProxyEventMock, TodoServiceMock, Logger);
    expect(logInfoSpy).toHaveBeenCalledTimes(1);
    expect(logInfoSpy).toHaveBeenCalledWith(logStatements.create.success, TodoMock);
  });

  it('should call logger.error if error is thrown', async () => {
    TodoServiceMock.create.mockRejectedValue("error");
    await createTodo(APIGatewayProxyEventMock, TodoServiceMock, Logger);
    expect(logErrSpy).toHaveBeenCalledTimes(1);
    expect(logErrSpy).toHaveBeenCalledWith(logStatements.create.error, "error");
  });

  it('should return a response object with status code 500 and the error message', async () => {
    TodoServiceMock.create.mockRejectedValue("error");
    const result = await createTodo(APIGatewayProxyEventMock, TodoServiceMock, Logger);
    expect(result.statusCode).toBe(500);
    expect(result.body).toBe(logStatements.create.error);
  });
});