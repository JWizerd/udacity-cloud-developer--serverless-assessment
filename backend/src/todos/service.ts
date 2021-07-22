import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { createDynamoDBClient } from '../dynamodb/utils/get-client';
import { TodoItem } from "./models/todo-item";
import { CreateTodoRequest } from "./dtos/create";
import { UpdateTodoRequest } from "./dtos/update";

const docClient: DocumentClient = createDynamoDBClient();
const groupsTable = process.env.GROUPS_TABLE;

const findAllTodos = async (client: DocumentClient = docClient): Promise<TodoItem[]> => {
  const result = await client.query({
    TableName: groupsTable,
  }).promise();

  return result.Items as TodoItem[];
}

const createTodo = async (todoItem: CreateTodoRequest, client: DocumentClient = docClient): Promise<TodoItem> => {
  await client.put({
    TableName: groupsTable,
    Item: todoItem
  }).promise();

  return todoItem as TodoItem;
}

const deleteTodo = async (todoId: string, client: DocumentClient = docClient): Promise<string> => {
  await client.delete({
    TableName: groupsTable,
    Key: {
      todoId
    }
  }).promise();

  return todoId;
}

const updateTodo = async (todoId: string, todoItem: UpdateTodoRequest, client: DocumentClient = docClient): Promise<TodoItem> => {
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

export default {
  findAllTodos,
  createTodo,
  deleteTodo,
  updateTodo
}
