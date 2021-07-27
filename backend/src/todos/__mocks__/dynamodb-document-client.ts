import { awsSdkPromise } from "../../utils/testing/aws-sdk-promise-response";
export class DocumentClientMock {
  query = jest.fn().mockReturnThis()
  promise: any = awsSdkPromise()
  delete = jest.fn().mockReturnThis()
  update = jest.fn().mockReturnThis()
  put = jest.fn().mockReturnThis()
}