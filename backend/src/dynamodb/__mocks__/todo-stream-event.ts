export const TodoEventStream = {
  "name": "remove attachment",
  "Records": [
    {
      "eventID": "ea94d7edf57af4f6766303ae43c197b1",
      "eventName": "REMOVE",
      "eventVersion": "1.1",
      "eventSource": "aws:dynamodb",
      "awsRegion": "us-east-1",
      "dynamodb": {
        "ApproximateCreationDateTime": 1627757290,
        "Keys": {
          "todoId": {
            "S": "16143997-0b10-4d76-999c-4bf77a92b397"
          },
          "userId": {
            "S": "google-oauth2|104488315124066106339"
          }
        },
        "OldImage": {
          "createdAt": {
            "S": "2021-07-31T18:47:32.411Z"
          },
          "dueDate": {
            "S": "2021-08-07"
          },
          "name": {
            "S": "mow lawn"
          },
          "todoId": {
            "S": "16143997-0b10-4d76-999c-4bf77a92b397"
          },
          "done": {
            "BOOL": false
          },
          "userId": {
            "S": "google-oauth2|104488315124066106339"
          }
        },
        "SequenceNumber": "3969600000000013688410860",
        "SizeBytes": 233,
        "StreamViewType": "OLD_IMAGE"
      },
      "eventSourceARN": "arn:aws:dynamodb:us-east-1:903501033061:table/Todos-Table-dev/stream/2021-07-30T22:03:10.926"
    }
  ],
  "level": "info",
  "message": "removing attachment from S3"
}