import { awsSdkPromise } from "../utils/testing/aws-sdk-promise-response";
import TodoService from "./service";
import { DocumentClientMock, TodoCollectionMock, TodoMockCreateRequest, TodoMockUpdateRequest } from "./__mocks__";
const mockTableName = "test-table";
const mockTodoId = "abc123";
describe("TodoService", () => {
  describe("findAll", () => {
    it('should call DocumentClient.query with correct params', async () => {
      const mockClient = new DocumentClientMock() as any;
      const todoService = new TodoService(mockClient, mockTableName);

      await todoService.findAll();

      expect(mockClient.query).toHaveBeenCalledWith({
        TableName: mockTableName
      });
    });

    it('should return a collection todo items', async () => {
      const mockClient = new DocumentClientMock() as any;
      mockClient.promise = awsSdkPromise({Items: TodoCollectionMock});
      const todoService = new TodoService(mockClient, mockTableName);

      await todoService.findAll();

      expect(mockClient.query).toHaveBeenCalledWith({
        TableName: mockTableName
      });
    });
  });

  describe("create", () => {
    it('should call DocumentClient.put with correct params', async () => {
      const mockClient = new DocumentClientMock() as any;
      const todoService = new TodoService(mockClient, mockTableName);

      await todoService.create(TodoMockCreateRequest);

      expect(mockClient.put).toHaveBeenCalledWith({
        TableName: mockTableName,
        Item: TodoMockCreateRequest
      });
    });

    it('should return newly created todo if put operation is successful', async () => {
      const mockClient = new DocumentClientMock() as any;
      mockClient.promise = awsSdkPromise(TodoMockCreateRequest);
      const todoService = new TodoService(mockClient, mockTableName);

      const result = await todoService.create(TodoMockCreateRequest);

      expect(result).toBe(TodoMockCreateRequest);
    });
  })

  describe("delete", () => {
    it('should call DocumentClient.delete with correct params', async () => {
      const mockClient = new DocumentClientMock() as any;
      const todoService = new TodoService(mockClient, mockTableName);

      await todoService.delete(mockTodoId);

      expect(mockClient.delete).toHaveBeenCalledWith({
        TableName: mockTableName,
        Key: {
          todoId: mockTodoId
        }
      });
    });

    it('should return todo id of deleted todo if delete operation is successful', async () => {
      const mockClient = new DocumentClientMock() as any;
      const todoService = new TodoService(mockClient, mockTableName);

      const result = await todoService.delete(mockTodoId);

      expect(result).toBe(mockTodoId);
    });
  });

  describe("update", () => {
    it('should call DocumentClient.update with correct params', async () => {
      const mockClient = new DocumentClientMock() as any;
      const todoService = new TodoService(mockClient, mockTableName);

      await todoService.update(mockTodoId, TodoMockUpdateRequest);

      expect(mockClient.update).toHaveBeenCalledWith({
        TableName: mockTableName,
        Key: {
          todoId: mockTodoId
        },
        UpdateExpression: "set info.name=:a, info.dueDate=:b, info.done=:c",
        ExpressionAttributeValues: {
          ":a": TodoMockUpdateRequest.name,
          ":b": TodoMockUpdateRequest.dueDate,
          ":c": TodoMockUpdateRequest.done
        },
        ReturnValues: "ALL_NEW"
      });
    });

    it('should return updated attributes if update operation was successful', async () => {
      const mockClient = new DocumentClientMock() as any;
      const todoService = new TodoService(mockClient, mockTableName);

      const result = await todoService.update(mockTodoId, TodoMockUpdateRequest);

      expect(result).toBe(TodoMockUpdateRequest);
    });
  });
});