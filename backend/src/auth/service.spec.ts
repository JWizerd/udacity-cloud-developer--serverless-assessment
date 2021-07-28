import { JwksClientMock, getPublicKey } from "./__mocks__/auth0-mock-jwks-client";
import auth0ClientResultMock from "./__mocks__/auth0-client-result";
import auth0DecodedJwtMock from "./__mocks__/auth0-decoded-jwt";
import auth0JwksMock from "./__mocks__/auth0-jwks";
import { noKidJwtMock } from "./__mocks__/no-kid-jwt";
import * as JwtManager from 'jsonwebtoken';
import { AuthService } from "./service";
import logStatements from "./log-statements";

let service: AuthService;
const jwksClientMock = new JwksClientMock() as any;

describe("AuthService", () => {
  beforeEach(() => {
    service = new AuthService(
      JwtManager,
      jwksClientMock
    )
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('getToken', () => {
    it('should throw no header error if header not defined', () => {
      try {
        service.getToken(undefined);
      } catch(error) {
        expect(error.message).toBe(logStatements.getToken.error.noheader);
      }
    });

    it('should throw wrong auth header if header is not bearer auth', () => {
      try {
        service.getToken("abc123");
      } catch (error) {
        expect(error.message).toBe(logStatements.getToken.error.invalidHeader);
      }
    });

    it('should return token in bearer auth header', () => {
      const token = service.getToken("Bearer abc123");
      expect(token).toBe("abc123");
    });
  });

  describe('getSigngingKey', () => {
    it('should call jwtClient.getSigningKey with correct params', async () => {
      await service.getSigningKey(auth0DecodedJwtMock);
      expect(jwksClientMock.getSigningKey).toHaveBeenCalledWith(auth0DecodedJwtMock.header.kid);
    });

    it('should call jwtClient.getSigningKey.getPublicKey with correct params', async () => {
      await service.getSigningKey(auth0DecodedJwtMock);
      expect(getPublicKey.getPublicKey).toHaveBeenCalled();
    });
  });

  describe('decodeToken', () => {
    it('should return decoded token', () => {
      const token = service.decodeToken(auth0ClientResultMock.idToken);
      expect(token).toEqual(auth0DecodedJwtMock);
    });

    it('should throw error if jwt has no kid in header', () => {
      try {
        service.decodeToken(noKidJwtMock);
      } catch (error) {
        expect(error.message).toBe(logStatements.decodeToken.error.noKid);
      }
    });
  });

  describe('verifyToken', () => {
    it('should call verifyToken with correct params', async () => {
      const mockBearerToken = `Bearer ${auth0ClientResultMock.idToken}`;
      jest.spyOn(service, "getToken").mockReturnValue(auth0ClientResultMock.idToken)
      jest.spyOn(service, "decodeToken").mockReturnValue(auth0DecodedJwtMock)
      jest.spyOn(service, "getSigningKey").mockResolvedValue(auth0JwksMock.keys[0].x5c[0])
      jest.spyOn(service, "getSigningKey").mockResolvedValue(auth0JwksMock.keys[0].x5c[0])
      const verifySpy = jest.spyOn(JwtManager, "verify").mockImplementation(null);
      await service.verifyToken(mockBearerToken)
      expect(verifySpy).toHaveBeenCalledTimes(1);
      expect(verifySpy).toHaveBeenCalledWith(
        auth0ClientResultMock.idToken,
        auth0JwksMock.keys[0].x5c[0],
        {
          algorithms: ["RS256"],
          complete: true
        }
      )
    });
  });
});