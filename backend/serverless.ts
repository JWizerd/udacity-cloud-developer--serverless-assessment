// Requiring @types/serverless in your project package.json
import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: "serverless-todo-app"
  },
  plugins: [
    "serverless-webpack",
    "serverless-iam-roles-per-function"
  ],
  provider: {
    name: "aws",
    runtime: "nodejs12.x",
    stage: "${opt:stage, 'dev'}",
    region: "${opt:region, 'us-east-1'}"
  },
  functions: {
    Auth: {
      "handler": "src/lambda/auth/auth0Authorizer.handler"
    },
    GetTodos: {
      handler: "src/lambda/http/getTodos.handler",
      events: [
        {
          http: {
            method: "get",
            path: "todos"
          }
        }
      ]
    },
    CreateTodo: {
      handler: "src/lambda/http/createTodo.handler",
      events: [
        {
          http: {
            method: "post",
            path: "todos"
          }
        }
      ]
    },
    UpdateTodo: {
      handler: "src/lambda/http/updateTodo.handler",
      events: [
        {
          http: {
            method: "patch",
            path: "todos/{todoId}"
          }
        }
      ]
    },
    DeleteTodo: {
      handler: "src/lambda/http/deleteTodo.handler",
      events: [
        {
          http: {
            method: "delete",
            path: "todos/{todoId}"
          }
        }
      ]
    },
    GenerateUploadUrl: {
      handler: "src/lambda/http/generateUploadUrl.handler",
      events: [
        {
          http: {
            method: "post",
            path: "todos/{todoId}/attachment"
          }
        }
      ]
    }
  },
  resources: {
    Resources: null
  }
};

module.exports = serverlessConfiguration;