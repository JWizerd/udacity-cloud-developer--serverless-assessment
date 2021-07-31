import { TodoRepositoryMock, APIGatewayProxyEventMock, TodoMock } from "../__mocks__";
import { createLogger } from "../../utils/logger";
import { createTodo } from "./create";
import logStatements from "../log-statements";

const Logger = createLogger("test");
const mockUserId = "acb123";
let getUserIdMock;
let logInfoSpy;
let logErrSpy;
describe('createTodo', () => {
  beforeEach(() => {
    logInfoSpy = jest.spyOn(Logger, "info").mockImplementation();
    logErrSpy = jest.spyOn(Logger, "error").mockImplementation();
    getUserIdMock = jest.fn().mockImplementation(() => mockUserId);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call repository.create and return status 201 with newly created object', async () => {
    TodoRepositoryMock.create.mockResolvedValueOnce(TodoMock);
    const result = await createTodo(APIGatewayProxyEventMock, TodoRepositoryMock, Logger, getUserIdMock);
    expect(result.statusCode).toBe(201);
    expect(result.body).toEqual(JSON.stringify({ item: TodoMock }));
  });

  it('should call repository.create with the correct params', async () => {
    TodoRepositoryMock.create.mockResolvedValueOnce(TodoMock);
    await createTodo(APIGatewayProxyEventMock, TodoRepositoryMock, Logger, getUserIdMock);
    expect(TodoRepositoryMock.create).toHaveBeenCalledTimes(1);
    expect(TodoRepositoryMock.create).toHaveBeenCalledWith(TodoMock, mockUserId);
  });

  it('should call logger.info with proper params', async () => {
    TodoRepositoryMock.create.mockResolvedValueOnce(TodoMock);
    await createTodo(APIGatewayProxyEventMock, TodoRepositoryMock, Logger, getUserIdMock);
    expect(logInfoSpy).toHaveBeenCalledTimes(1);
    expect(logInfoSpy).toHaveBeenCalledWith(logStatements.create.success, TodoMock);
  });

  it('should call logger.error if error is thrown', async () => {
    TodoRepositoryMock.create.mockRejectedValue("error");
    await createTodo(APIGatewayProxyEventMock, TodoRepositoryMock, Logger, getUserIdMock);
    expect(logErrSpy).toHaveBeenCalledTimes(1);
    expect(logErrSpy).toHaveBeenCalledWith(logStatements.create.error, "error");
  });

  it('should return a response object with status code 500 and the error message', async () => {
    TodoRepositoryMock.create.mockRejectedValue("error");
    const result = await createTodo(APIGatewayProxyEventMock, TodoRepositoryMock, Logger, getUserIdMock);
    expect(result.statusCode).toBe(500);
    expect(result.body).toBe(logStatements.create.error);
  });
});