import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { createDynamoDBClient } from '../dynamodb/utils/get-client';
import { TodoItem } from "./models/todo-item";
import { CreateTodoRequest } from "./dtos/create";
import { UpdateTodoRequest } from "./dtos/update";
import { Repository } from "../types/repository";
import * as uuid from "uuid";

export default class TodoRepository implements Repository {
  constructor(
    private readonly client: DocumentClient = createDynamoDBClient(),
    private readonly table: string = process.env.TODOS_TABLE
  ) {}

  async findAll(userId: string): Promise<TodoItem[]> {
    var params: DocumentClient.QueryInput = {
      ExpressionAttributeValues: {
        ':userId': userId
      },
      IndexName: process.env.TODO_SECONDARY_LOCAL_INDEX_NAME,
      KeyConditionExpression: 'userId = :userId',
      TableName: this.table
    };

    const result = await this.client.query(params).promise();

    return result.Items as TodoItem[];
  }

  async create(todoItem: CreateTodoRequest, userId: string): Promise<TodoItem> {
    const newTodoItem: TodoItem = {
      todoId: uuid.v4(),
      createdAt: new Date().toISOString(),
      done: false,
      userId,
      ...todoItem,
    } as TodoItem;

    await this.client.put({
      TableName: this.table,
      Item: newTodoItem
    }).promise();

    return newTodoItem as TodoItem;
  }

  async delete(todoId: string, userId: string): Promise<string> {
    await this.client.delete({
      TableName: this.table,
      Key: {
        todoId,
        userId
      }
    }).promise();

    return todoId;
  }

  async update(todoId: string, todoItem: UpdateTodoRequest, userId: string): Promise<TodoItem> {
    await this.client.update({
      TableName: this.table,
      Key: {
        todoId: todoId,
        userId: userId,
      },
      UpdateExpression: "set info.name=:a, info.dueDate=:b, info.done=:c, info.attachmentUrl=:d",
      ExpressionAttributeValues: {
        ":a": todoItem.name,
        ":b": todoItem.dueDate,
        ":c": todoItem.done,
        ":d": todoItem.attachmentUrl
      },
      ReturnValues: "ALL_NEW"
    }).promise();

    return todoItem as TodoItem;
  }
}