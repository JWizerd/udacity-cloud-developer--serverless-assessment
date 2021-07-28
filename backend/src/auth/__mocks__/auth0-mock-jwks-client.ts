export const getPublicKey = {
  getPublicKey: jest.fn()
};
export class JwksClientMock {
  getSigningKey = jest.fn().mockResolvedValue(getPublicKey)
}