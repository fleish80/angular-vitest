describe('Test Filtering', () => {
  it('this test runs normally', () => {
    expect(true).toBe(true);
  });

  it.skip('this test is skipped', () => {
    expect(true).toBe(false);
  });

  it.todo('should validate email format');
  it.todo('should handle network timeout');
  it.todo('should retry failed requests');
});

describe('Concurrent Tests', () => {
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  it.concurrent('concurrent test A', async () => {
    await delay(10);
    expect(1 + 1).toBe(2);
  });

  it.concurrent('concurrent test B', async () => {
    await delay(10);
    expect(2 + 2).toBe(4);
  });

  it.concurrent('concurrent test C', async () => {
    await delay(10);
    expect(3 + 3).toBe(6);
  });
});

describe.shuffle('Randomized Order', () => {
  const order: string[] = [];

  afterAll(() => {
    console.log('  [shuffle] Execution order:', order.join(', '));
  });

  it('test Alpha', () => {
    order.push('Alpha');
    expect(true).toBe(true);
  });

  it('test Beta', () => {
    order.push('Beta');
    expect(true).toBe(true);
  });

  it('test Gamma', () => {
    order.push('Gamma');
    expect(true).toBe(true);
  });

  it('test Delta', () => {
    order.push('Delta');
    expect(true).toBe(true);
  });
});
