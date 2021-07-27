import { CreateTodoRequest } from "../dtos/create";
import { UpdateTodoRequest } from "../dtos/update";
import { TodoItem } from "../models/todo-item";

export const TodoMock: TodoItem = {
  userId: 'abc123',
  todoId: 'cde456',
  createdAt: '1999-08-01',
  dueDate: '2021-07-23',
  name: 'finish homework',
  done: false,
}

export const TodoMockCreateRequest: CreateTodoRequest = {
  name: "test todo",
  dueDate: "2020-01-01"
}

export const TodoMockUpdateRequest: UpdateTodoRequest = {
  name: "test todo",
  dueDate: "2020-01-01",
  done: false
}

export const TodoCollectionMock: TodoItem[] = [TodoMock, TodoMock, TodoMock];