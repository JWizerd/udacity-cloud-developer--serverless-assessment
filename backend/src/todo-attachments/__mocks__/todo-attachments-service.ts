import { AttachmentsService } from "../attachments-service.interface";

export class TodoAttachmentsServiceMock implements AttachmentsService {
  getUploadUrl = jest.fn()
  delete = jest.fn()
}