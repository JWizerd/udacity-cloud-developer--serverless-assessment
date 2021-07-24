import { TodoItem } from "../models/todo-item";

export const TodoMock: TodoItem = {
  userId: 'abc123',
  todoId: 'cde456',
  createdAt: '1999-08-01',
  dueDate: '2021-07-23',
  name: 'finish homework',
  done: false,
}

export const TodoCollectionMock: TodoItem[] = [TodoMock, TodoMock, TodoMock];