import { awsSdkPromise } from "../utils/testing/aws-sdk-promise-response";
import TodoService from "./service";
import { DocumentClientMock, TodoMockCreateRequest, TodoMockUpdateRequest } from "./__mocks__";
const mockTableName = "test-table";
const mockTodoId = "abc123";
const mockUserId = "1";
const mockTodo = {
  ...TodoMockCreateRequest,
  userId: mockUserId,
  done: false
}
process.env.TODO_SECONDARY_LOCAL_INDEX_NAME = "test_index";
const mockCollection = [mockTodo, mockTodo, mockTodo]

describe("TodoService", () => {
  describe("findAll", () => {
    it('should call DocumentClient.query with correct params', async () => {
      const mockClient = new DocumentClientMock() as any;
      const todoService = new TodoService(mockClient, mockTableName);

      await todoService.findAll(mockUserId);

      expect(mockClient.query).toHaveBeenCalledWith({
        ExpressionAttributeValues: {
          ':userId': mockUserId
        },
        IndexName: process.env.TODO_SECONDARY_LOCAL_INDEX_NAME,
        KeyConditionExpression: 'userId = :s',
        TableName: mockTableName
      });
    });

    it('should return a collection todo items', async () => {
      const mockClient = new DocumentClientMock() as any;
      mockClient.promise = awsSdkPromise({ Items: mockCollection});
      const todoService = new TodoService(mockClient, mockTableName);

      const results = await todoService.findAll(mockUserId);

      expect(results).toBe(mockCollection);
    });
  });

  describe("create", () => {
    it('should call DocumentClient.put with correct params', async () => {
      const mockClient = new DocumentClientMock() as any;
      const todoService = new TodoService(mockClient, mockTableName);

      const result = await todoService.create(TodoMockCreateRequest, mockUserId);

      expect(mockClient.put).toHaveBeenCalledWith({
        TableName: mockTableName,
        Item: result
      });
    });

    it('should return newly created todo if put operation is successful', async () => {
      const mockClient = new DocumentClientMock() as any;
      mockClient.promise = awsSdkPromise(TodoMockCreateRequest);
      const todoService = new TodoService(mockClient, mockTableName);

      const result = await todoService.create(TodoMockCreateRequest, mockUserId);

      expect(result.createdAt).toBeDefined();
      expect(result.todoId).toBeDefined();
      expect(result.name).toBeDefined();
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