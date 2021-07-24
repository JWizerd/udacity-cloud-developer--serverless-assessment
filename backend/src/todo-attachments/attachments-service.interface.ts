import { Service } from "../interfaces/service";

export interface AttachmentsService extends Service {
  getUploadUrl(todoId: string): Promise<string>
}