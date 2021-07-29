import { AuthServiceMock, decodedTokenMock } from "../__mocks__/auth-service";
import { createLogger } from "../../utils/logger";
import { authorizer } from "./auth0-authorizer";
import logStatements from "../log-statements";
import { APIGatewayTokenAuthorizerEventMock as event } from "../__mocks__/api-gateway-token-auth-event";

const logger = createLogger("test");
let logInfoSpy;
let logErrSpy;
describe('createTodo', () => {
  beforeEach(() => {
    logInfoSpy = jest.spyOn(logger, "info").mockImplementation();
    logErrSpy = jest.spyOn(logger, "error").mockImplementation();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call service.verifyToken with correct params', async () => {
    const service = new AuthServiceMock();
    await authorizer(event as any, service as any, logger);
    expect(service.verifyToken).toHaveBeenCalledTimes(1);
    expect(service.verifyToken).toHaveBeenCalledWith(event.authorizationToken);
  });

  it('should return an access granted policy', async () => {
    const service = new AuthServiceMock();
    const result = await authorizer(event as any, service as any, logger);

    expect(result).toEqual({
      principalId: decodedTokenMock.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    })
  });

  it('should call logger.info with correct params', async () => {
    const service = new AuthServiceMock();
    await authorizer(event as any, service as any, logger);
    expect(logInfoSpy).toHaveBeenCalledTimes(1);
    expect(logInfoSpy).toHaveBeenCalledWith(logStatements.authorizer.success, decodedTokenMock);
  });

  it('should call logger.error with correct params', async () => {
    const service = new AuthServiceMock();
    service.verifyToken.mockRejectedValue("error");
    await authorizer(event as any, service as any, logger);
    expect(logErrSpy).toHaveBeenCalledTimes(1);
    expect(logErrSpy).toHaveBeenCalledWith(logStatements.authorizer.error, "error");
  });

  it('should return access denied policy', async () => {
    const service = new AuthServiceMock().verifyToken.mockRejectedValue(null);
    const result = await authorizer(event as any, service as any, logger);

    expect(result).toEqual({
      principalId: 'user',
        policyDocument: {
        Version: '2012-10-17',
          Statement: [
            {
              Action: 'execute-api:Invoke',
              Effect: 'Deny',
              Resource: '*'
            }
          ]
      }
    });
  });
});