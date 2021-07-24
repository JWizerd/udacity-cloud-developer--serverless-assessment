import * as S3 from "aws-sdk/clients/s3";
import { Service } from "../interfaces/service";

export class TodoAttachmentService implements Service {
  constructor(
    private readonly s3: S3 = new S3(),
    private readonly bucketName: string = process.env.TODO_ATTACHMENTS_S3_BUCKET,
    private readonly urlExpiration: number = parseInt(process.env.SIGNED_URL_EXPIRATION, 10)
  ) {}

  async getUploadUrl(todoId: string) {
    return this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: todoId,
      Expires: this.urlExpiration
    });
  }

  async delete(todoId: string) {
    await this.s3.deleteObject({
      Key: todoId,
      Bucket: this.bucketName
    }).promise();
  }
}