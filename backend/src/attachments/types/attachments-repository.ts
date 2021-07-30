import { Repository } from "../../types/repository";

export interface AttachmentsRepositoryInterface extends Repository {
  getUploadUrl(todoId: string): Promise<string>
}