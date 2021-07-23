import { TodoServiceMock, APIGatewayProxyEventMock, TodoMock } from "../__mocks__";
import { createLogger } from "../../utils/logger";
import { createTodo } from "./create";

const Logger = createLogger("test");

describe('createTodo', () => {
  it('should call service.create and return status 201 with newly created object', async () => {
    const logInfoSpy = jest.spyOn(Logger, "info");
    TodoServiceMock.create.mockResolvedValueOnce(TodoMock)
    const result = await createTodo(APIGatewayProxyEventMock, TodoServiceMock, Logger);
    expect(result.statusCode).toBe(201);
    expect(result.body).toEqual(JSON.stringify(TodoMock));
    expect(logInfoSpy).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.resetAllMocks();
  })
});