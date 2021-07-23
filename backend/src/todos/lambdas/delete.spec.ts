import { TodoServiceMock } from "../__mocks__";
import { createLogger } from "../../utils/logger";
import { deleteTodo } from "./delete";
import logStatements from "../log-statements";

const MockTodoId = "abc123";

const MockDeleteBody = {
  pathParameters: {
    todoId: MockTodoId
  }
}

const Logger = createLogger("test");
let logInfoSpy;
let logErrSpy;

describe('deleteTodo', () => {
  beforeEach(() => {
    logInfoSpy = jest.spyOn(Logger, "info").mockImplementation();
    logErrSpy = jest.spyOn(Logger, "error").mockImplementation();
  });

  afterEach(() => {
    jest.resetAllMocks();
  })

  it('should return status code 204 with an empty body', async () => {
    const result = await deleteTodo(MockDeleteBody, TodoServiceMock, Logger);
    expect(result.statusCode).toBe(204);
    expect(result.body).toBe("");
  });

  it('should call logger.info with correct params', async () => {
    await deleteTodo(MockDeleteBody, TodoServiceMock, Logger);
    expect(logInfoSpy).toHaveBeenCalledTimes(1);
    expect(logInfoSpy).toHaveBeenCalledWith(logStatements.delete.success, MockTodoId);
  });

  it('should call logger.error with correct params', async () => {
    TodoServiceMock.delete.mockRejectedValue("error");
    await deleteTodo(MockDeleteBody, TodoServiceMock, Logger);
    expect(logErrSpy).toHaveBeenCalledTimes(1);
    expect(logErrSpy).toHaveBeenCalledWith(logStatements.delete.error, "error");
  });

  it('should respond with status code error 500 with error message', async () => {
    TodoServiceMock.delete.mockRejectedValue("error");
    const result = await deleteTodo(MockDeleteBody, TodoServiceMock, Logger);
    expect(result.statusCode).toBe(500);
    expect(result.body).toBe(logStatements.delete.error);
  });
});