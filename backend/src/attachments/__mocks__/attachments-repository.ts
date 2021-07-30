import { AttachmentsRepositoryInterface } from "../types/attachments-repository";

export class AttachmentsRepositoryMock implements AttachmentsRepositoryInterface {
  getUploadUrl = jest.fn()
  delete = jest.fn()
}