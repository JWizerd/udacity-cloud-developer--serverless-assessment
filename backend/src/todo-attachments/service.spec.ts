describe('TodoAttachmentService', () => {
  const mS3Instance = {
    getSignedUrl: jest.fn(),
    deleteObject: jest.fn().mockReturnThis(),
    promise: jest.fn(),
  };

  jest.mock('aws-sdk', () => {
    return { S3: jest.fn(() => mS3Instance) };
  });

  it('should ', () => {
    expect(true).toBe(false);
  });
});

