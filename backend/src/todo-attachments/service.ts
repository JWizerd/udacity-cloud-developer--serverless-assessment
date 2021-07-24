import * as S3 from "aws-sdk/clients/s3";
import { AttachmentsService } from "./attachments-service.interface";

export class TodoAttachmentService implements AttachmentsService {
  constructor(
    private readonly s3: S3 = new S3(),
    private readonly bucketName: string = process.env.TODO_ATTACHMENTS_S3_BUCKET,
    private readonly urlExpiration: number = parseInt(process.env.SIGNED_URL_EXPIRATION, 10)
  ) {}

  async getUploadUrl(todoId: string) {
    return this.s3.getSignedUrlPromise('putObject', {
      Bucket: this.bucketName,
      Key: todoId,
      Expires: this.urlExpiration
    });
  }

  async delete(todoId: string) {
    return this.s3.deleteObject({
      Key: todoId,
      Bucket: this.bucketName
    }).promise();
  }
}