export const awsSdkPromiseResponse = jest.fn().mockReturnValue(Promise.resolve(true));

const deleteObjectMock = jest.fn().mockImplementation(() => ({ promise: awsSdkPromiseResponse }));

export class S3 {
  getSignedUrl = jest.fn();
  deleteObject = deleteObjectMock;
}