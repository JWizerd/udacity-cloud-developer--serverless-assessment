export const TodoEventStream = {
  Records: [
    {
      eventName: "REMOVE",
      dynamodb: {
        OldImage: {
          todoId: {
            S: "abc123"
          }
        }
      }
    }
  ]
}