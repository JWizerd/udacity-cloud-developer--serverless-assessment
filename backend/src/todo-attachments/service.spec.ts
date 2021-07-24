import { TodoAttachmentService } from "./service";
import * as AWSMock from 'jest-aws-sdk-mock';
// Make sure to mock any functions before importing client
import * as AWS from "aws-sdk";

const mockBucketName = "test-bucket";
const mockUrlExpDate = 300;
const mockTodoId = "abc123";
AWSMock.setSDKInstance(AWS);

describe('TodoAttachmentService', () => {
  afterAll(() => {
    AWSMock.restore("S3");
  });

  it('should return a signed url with the correct properties', async () => {
    AWSMock.mock('S3', 'getSignedUrl', jest.fn);
    const s3 = new AWS.S3();
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
    AWSMock.mock('S3', 'deleteObject', null);
    const s3 = new AWS.S3();
    const Service = new TodoAttachmentService(s3, mockBucketName, mockUrlExpDate)
    await Service.delete(mockTodoId);
    expect(s3.deleteObject).toHaveBeenCalledTimes(1);
    expect(s3.deleteObject).toHaveBeenCalledWith({
      Key: mockTodoId,
      Bucket: mockBucketName
    });
  });
});

