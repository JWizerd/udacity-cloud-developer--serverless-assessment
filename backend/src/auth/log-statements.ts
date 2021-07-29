export default {
  authorizer: {
    name: "authorize user",
    success: "successfully authorized user",
    error: "failed to authorize user"
  },
  decodeToken: {
    error: {
      noKid: "No kid provided in token!"
    }
  },
  getToken: {
    error: {
      noheader: 'No authentication header',
      invalidHeader: 'Invalid authentication header'
    }
  },
  getSigningKey: {
    error: {
      noAssocKey: "Key was not signed by application"
    }
  }
}