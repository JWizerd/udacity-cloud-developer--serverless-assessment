import 'source-map-support/register'
import { APIGatewayTokenAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import { AuthService } from '../service'
import logStatements from '../log-statements'
import { Logger } from 'winston'
import { createLogger } from '../../utils/logger'

export const authorizer = async (event: APIGatewayTokenAuthorizerEvent, service: AuthService, logger: Logger) => {
  try {
    const decodedToken = await service.verifyToken(event.authorizationToken);

    logger.info(logStatements.authorizer.success, decodedToken)

    return {
      principalId: decodedToken.sub,
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
    }
  } catch (e) {
    logger.error(logStatements.authorizer.error, e)

    return {
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
    }
  }
}

export const handler = async (event: APIGatewayTokenAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  const service = new AuthService();
  const logger = createLogger(logStatements.authorizer.name);
  return authorizer(event, service, logger)
}