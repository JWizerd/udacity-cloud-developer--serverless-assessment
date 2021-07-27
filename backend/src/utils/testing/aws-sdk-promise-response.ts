export const awsSdkPromise = (mockValue: any = true) => jest.fn().mockImplementation(() => ({
  promise: jest.fn().mockReturnValue(Promise.resolve(mockValue))
}));