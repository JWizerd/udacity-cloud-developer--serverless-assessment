import { AttachmentsRepositoryInterface } from "../attachments-repository.interface";

export class AttachmentsRepositoryMock implements AttachmentsRepositoryInterface {
  getUploadUrl = jest.fn()
  delete = jest.fn()
}