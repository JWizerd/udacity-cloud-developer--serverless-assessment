import { TodoMock } from "./todo";

export const APIGatewayProxyEventMock = {
  body: JSON.stringify(TodoMock),
  pathParameters: {
    todoId: "abc123"
  }
}

export const APIGatewayProxyEventCollectionMock = {
  body: JSON.stringify([TodoMock, TodoMock])
}