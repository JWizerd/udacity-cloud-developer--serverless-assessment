import { AttachmentsRepository } from "./attachments-repository";
import { awsSdkPromise } from "../utils/testing/aws-sdk-promise-response";
import * as S3 from "aws-sdk/clients/s3";

const mockBucketName = "test-bucket";
const mockUrlExpDate = 300;
const mockTodoId = "abc123";


jest.mock("aws-sdk/clients/s3", () => {
  return class {
    getSignedUrlPromise = jest.fn().mockResolvedValue(null)
    deleteObject = jest.fn().mockReturnThis()
    promise = awsSdkPromise()
  }
});

let s3;
let Repository;

describe('AttachmentsRepository', () => {
  beforeEach(() => {
    s3 = new S3();
    Repository = new AttachmentsRepository(s3, mockBucketName, mockUrlExpDate)
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return a signed url with the correct properties', async () => {
    await Repository.getUploadUrl(mockTodoId);
    expect(s3.getSignedUrlPromise).toHaveBeenCalledTimes(1);
    expect(s3.getSignedUrlPromise).toHaveBeenCalledWith("putObject", {
      Bucket: mockBucketName,
      Key: mockTodoId,
      Expires: 300
    });
  });

  it('should all s3.deleteObject with correct params', async () => {
    await Repository.delete(mockTodoId);
    expect(s3.deleteObject).toHaveBeenCalledTimes(1);
    expect(s3.deleteObject).toHaveBeenCalledWith({
      Key: mockTodoId,
      Bucket: mockBucketName
    });
  });
});

