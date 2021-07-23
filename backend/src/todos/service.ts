import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { createDynamoDBClient } from '../dynamodb/utils/get-client';
import { TodoItem } from "./models/todo-item";
import { CreateTodoRequest } from "./dtos/create";
import { UpdateTodoRequest } from "./dtos/update";
import { Service } from "../interfaces/service";

const docClient: DocumentClient = createDynamoDBClient();
const groupsTable = process.env.GROUPS_TABLE;

export default class TodoService implements Service {
  constructor(
    private readonly client: DocumentClient = createDynamoDBClient(),
    private readonly table: string = groupsTable
  ) {}

  async findAll(): Promise<TodoItem[]> {
    const result = await this.client.query({
      TableName: this.table,
    }).promise();

    return result.Items as TodoItem[];
  }

  async create(todoItem: CreateTodoRequest): Promise<TodoItem> {
    await this.client.put({
      TableName: this.table,
      Item: todoItem
    }).promise();

    return todoItem as TodoItem;
  }

  async delete(todoId: string): Promise<string> {
    await this.client.delete({
      TableName: this.table,
      Key: {
        todoId
      }
    }).promise();

    return todoId;
  }

  async update(todoId: string, todoItem: UpdateTodoRequest, client: DocumentClient = docClient): Promise<TodoItem> {
    const result = await client.update({
      TableName: groupsTable,
      Key: {
        todoId: todoId
      },
      UpdateExpression: "set info.name = :a, info.dueDate=:b, info.done=:c",
      ExpressionAttributeValues: {
        ":a": todoItem.name,
        ":b": todoItem.dueDate,
        ":c": todoItem.done
      },
      ReturnValues: "ALL_NEW"
    }).promise();

    return result.$response.data as TodoItem;
  }
}