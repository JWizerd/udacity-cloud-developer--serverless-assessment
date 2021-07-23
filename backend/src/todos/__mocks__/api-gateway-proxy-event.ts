import { TodoMock } from "./todo";

export const APIGatewayProxyEventMock = {
  body: JSON.stringify(TodoMock)
}

export const APIGatewayProxyEventCollectionMock = {
  body: JSON.stringify([TodoMock, TodoMock])
}