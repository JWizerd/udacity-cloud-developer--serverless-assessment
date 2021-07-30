import { publicSigningKeyMock } from "./public-signing-key-mock";

export const getPublicKey = {
  getPublicKey: jest.fn().mockReturnValue(publicSigningKeyMock)
};
export class JwksClientMock {
  getSigningKey = jest.fn().mockResolvedValue(getPublicKey)
}