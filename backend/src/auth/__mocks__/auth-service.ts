export const decodedTokenMock = {
  sub: "abc123"
}
export class AuthServiceMock {
  verifyToken = jest.fn().mockResolvedValue(decodedTokenMock)
}