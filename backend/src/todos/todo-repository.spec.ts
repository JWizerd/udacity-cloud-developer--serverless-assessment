import { awsSdkPromise } from "../utils/testing/aws-sdk-promise-response";
import TodoRepository from "./todo-repository";
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

describe("TodoRepository", () => {
  describe("findAll", () => {
    it('should call DocumentClient.query with correct params', async () => {
      const mockClient = new DocumentClientMock() as any;
      const todoRepo = new TodoRepository(mockClient, mockTableName);

      await todoRepo.findAll(mockUserId);

      expect(mockClient.query).toHaveBeenCalledWith({
        ExpressionAttributeValues: {
          ':userId': mockUserId
        },
        IndexName: process.env.TODO_SECONDARY_LOCAL_INDEX_NAME,
        KeyConditionExpression: 'userId = :userId',
        TableName: mockTableName
      });
    });

    it('should return a collection todo items', async () => {
      const mockClient = new DocumentClientMock() as any;
      mockClient.promise = awsSdkPromise({ Items: mockCollection});
      const todoRepo = new TodoRepository(mockClient, mockTableName);

      const results = await todoRepo.findAll(mockUserId);

      expect(results).toBe(mockCollection);
    });
  });

  describe("create", () => {
    it('should call DocumentClient.put with correct params', async () => {
      const mockClient = new DocumentClientMock() as any;
      const todoRepo = new TodoRepository(mockClient, mockTableName);

      const result = await todoRepo.create(TodoMockCreateRequest, mockUserId);

      expect(mockClient.put).toHaveBeenCalledWith({
        TableName: mockTableName,
        Item: result
      });
    });

    it('should return newly created todo if put operation is successful', async () => {
      const mockClient = new DocumentClientMock() as any;
      mockClient.promise = awsSdkPromise(TodoMockCreateRequest);
      const todoRepo = new TodoRepository(mockClient, mockTableName);

      const result = await todoRepo.create(TodoMockCreateRequest, mockUserId);

      expect(result.createdAt).toBeDefined();
      expect(result.todoId).toBeDefined();
      expect(result.name).toBeDefined();
    });
  })

  describe("delete", () => {
    it('should call DocumentClient.delete with correct params', async () => {
      const mockClient = new DocumentClientMock() as any;
      const todoRepo = new TodoRepository(mockClient, mockTableName);

      await todoRepo.delete(mockTodoId, mockUserId);

      expect(mockClient.delete).toHaveBeenCalledWith({
        TableName: mockTableName,
        Key: {
          todoId: mockTodoId,
          userId: mockUserId
        }
      });
    });

    it('should return todo id of deleted todo if delete operation is successful', async () => {
      const mockClient = new DocumentClientMock() as any;
      const todoRepo = new TodoRepository(mockClient, mockTableName);

      const result = await todoRepo.delete(mockTodoId, mockUserId);

      expect(result).toBe(mockTodoId);
    });
  });

  describe("update", () => {
    it('should call DocumentClient.update with correct params', async () => {
      const mockClient = new DocumentClientMock() as any;
      const todoRepo = new TodoRepository(mockClient, mockTableName);

      await todoRepo.update(mockTodoId, TodoMockUpdateRequest, mockUserId);

      expect(mockClient.update).toHaveBeenCalledWith({
        TableName: mockTableName,
        Key: {
          todoId: mockTodoId,
          userId: mockUserId
        },
        UpdateExpression: "set info.name=:a, info.dueDate=:b, info.done=:c, info.attachmentUrl=:d",
        ExpressionAttributeValues: {
          ":a": TodoMockUpdateRequest.name,
          ":b": TodoMockUpdateRequest.dueDate,
          ":c": TodoMockUpdateRequest.done,
          ":d": TodoMockUpdateRequest.attachmentUrl
        },
        ReturnValues: "ALL_NEW"
      });
    });

    it('should return updated attributes if update operation was successful', async () => {
      const mockClient = new DocumentClientMock() as any;
      const todoRepo = new TodoRepository(mockClient, mockTableName);

      const result = await todoRepo.update(mockTodoId, TodoMockUpdateRequest, mockUserId);

      expect(result).toBe(TodoMockUpdateRequest);
    });
  });
});