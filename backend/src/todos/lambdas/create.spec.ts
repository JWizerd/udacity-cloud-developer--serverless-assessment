import { TodoServiceMock, APIGatewayProxyEventMock, TodoMock } from "../__mocks__";
import { createLogger } from "../../utils/logger";
import { createTodo } from "./create";
import logStatements from "../log-statements";

const Logger = createLogger("test");

describe('createTodo', () => {
  it('should call service.create and return status 201 with newly created object', async () => {
    jest.spyOn(Logger, "info");
    TodoServiceMock.create.mockResolvedValueOnce(TodoMock)
    const result = await createTodo(APIGatewayProxyEventMock, TodoServiceMock, Logger);
    expect(result.statusCode).toBe(201);
    expect(result.body).toEqual(JSON.stringify(TodoMock));
  });

  it('should call service.create and log success to logger', async () => {
    const logInfoSpy = jest.spyOn(Logger, "info");
    TodoServiceMock.create.mockResolvedValueOnce(TodoMock)
    await createTodo(APIGatewayProxyEventMock, TodoServiceMock, Logger);
    expect(logInfoSpy).toHaveBeenCalledTimes(1);
    expect(logInfoSpy).toHaveBeenCalledWith(logStatements.create.success, TodoMock);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});