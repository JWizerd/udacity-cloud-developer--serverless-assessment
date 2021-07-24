import { TodoAttachmentService } from "./service";
import * as S3 from "aws-sdk/clients/s3";

const mockBucketName = "test-bucket";
const mockUrlExpDate = 300;
const mockTodoId = "abc123";
export const awsSdkPromiseResponse = jest.fn().mockReturnValue(Promise.resolve(true));

jest.mock("aws-sdk/clients/s3", () => {
  return class {
    getSignedUrl = jest.fn()
    deleteObject = jest.fn().mockReturnThis()
    promise = jest.fn().mockImplementation(() => ({ promise: awsSdkPromiseResponse }))
  }
});

describe('TodoAttachmentService', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should return a signed url with the correct properties', async () => {
    const s3 = new S3();
    const Service = new TodoAttachmentService(s3, mockBucketName, mockUrlExpDate)
    await Service.getUploadUrl(mockTodoId);
    expect(s3.getSignedUrl).toHaveBeenCalledTimes(1);
    expect(s3.getSignedUrl).toHaveBeenCalledWith("putObject", {
      Bucket: mockBucketName,
      Key: mockTodoId,
      Expires: 300
    });
  });

  it('should return a signed url with the correct properties', async () => {
    const s3 = new S3();
    const Service = new TodoAttachmentService(s3, mockBucketName, mockUrlExpDate)
    await Service.delete(mockTodoId);
    expect(s3.deleteObject).toHaveBeenCalledTimes(1);
    expect(s3.deleteObject).toHaveBeenCalledWith({
      Key: mockTodoId,
      Bucket: mockBucketName
    });
  });
});

