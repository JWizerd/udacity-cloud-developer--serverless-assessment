import * as JwtManager from 'jsonwebtoken';
import 'source-map-support/register'
import { JwksClient } from 'jwks-rsa';
import logStatements from "./log-statements";

export class AuthService {
  constructor(
    private readonly jwtManager = JwtManager,
    private readonly jwksClient: JwksClient = new JwksClient({
      jwksUri: process.env.AUTH0_JWKS_ENDPOINT
    })
  ) {}

  async verifyToken(authHeader: string): Promise<JwtManager.JwtPayload> {
    const token = this.getToken(authHeader);
    const tokenDecoded = this.decodeToken(token);
    const signingKey = await this.getSigningKey(tokenDecoded);
    return this.jwtManager.verify(
      token,
      signingKey,
      {
        algorithms: ["RS256"],
        complete: true
      }
    ) as JwtManager.Jwt;
  }

  decodeToken(token: string) {
    const jwt = this.jwtManager.decode(token, { complete: true }) as JwtManager.Jwt;
    if (!jwt.header.kid) throw new Error(logStatements.decodeToken.error.noKid);
    return jwt;
  }

  async getSigningKey(jwt: JwtManager.Jwt): Promise<string> {
    const signingKey = await this.jwksClient.getSigningKey(jwt.header.kid);
    if (!signingKey) throw new Error(logStatements.getSigningKey.error.noAssocKey);
    return signingKey.getPublicKey();
  }

  getToken(authHeader: string): string {
    if (!authHeader) throw new Error(logStatements.getToken.error.noheader)

    if (!authHeader.toLowerCase().startsWith('bearer ')) {
      throw new Error(logStatements.getToken.error.invalidHeader)
    }
    const split = authHeader.split(' ')
    const token = split[1]

    return token
  }
}