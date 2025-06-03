// Simple smoke test to validate the setup
describe('Basic Setup', () => {
  it('should pass a basic test', () => {
    expect(true).toBe(true);
  });
  it('should be able to import from the generated client', async () => {
    const { HealthApi } = await import('@/apis/HealthApi');
    expect(HealthApi).toBeDefined();
  });
});
