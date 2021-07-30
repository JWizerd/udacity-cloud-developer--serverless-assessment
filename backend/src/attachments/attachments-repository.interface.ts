import { Repository } from "../interfaces/repository";

export interface AttachmentsRepositoryInterface extends Repository {
  getUploadUrl(todoId: string): Promise<string>
}