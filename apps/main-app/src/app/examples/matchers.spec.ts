describe('Object & Array Matchers', () => {
  it('should deep-equal objects', () => {
    expect({ a: 1, b: { c: 2 } }).toEqual({ a: 1, b: { c: 2 } });
  });

  it('should strictly equal (catches undefined props)', () => {
    const obj = { a: 1 };
    expect(obj).not.toStrictEqual({ a: 1, b: undefined });
  });

  it('should check array contents', () => {
    expect([1, 2, 3]).toContain(2);
    expect([{ id: 1 }, { id: 2 }]).toContainEqual({ id: 2 });
    expect([1, 2, 3]).toHaveLength(3);
  });

  it('should check object properties', () => {
    const config = { name: 'Vitest', version: 4, experimental: true };
    expect(config).toHaveProperty('name');
    expect(config).toHaveProperty('version', 4);
    expect(config).toHaveProperty('experimental', true);
  });
});

describe('Exception Matchers', () => {
  it('should assert a function throws', () => {
    expect(() => {
      throw new Error('boom');
    }).toThrow();
  });

  it('should match error message', () => {
    expect(() => {
      throw new Error('Database connection failed');
    }).toThrow('Database connection failed');
  });

  it('should match error by regex', () => {
    expect(() => {
      throw new Error('Unexpected token at line 42');
    }).toThrow(/Unexpected token/);
  });

  it('should match error type', () => {
    expect(() => {
      throw new TypeError('Invalid argument');
    }).toThrow(TypeError);
  });

  it('should assert no throw', () => {
    expect(() => 'safe operation').not.toThrow();
  });
});

describe('Asymmetric Matchers', () => {
  it('should match any instance of a type', () => {
    expect({
      id: 1,
      name: 'Angular',
      created: new Date(),
    }).toEqual({
      id: expect.any(Number),
      name: expect.any(String),
      created: expect.any(Date),
    });
  });

  it('should match string contents', () => {
    expect({ message: 'Hello World' }).toEqual({
      message: expect.stringContaining('World'),
    });

    expect({ path: '/api/v2/users' }).toEqual({
      path: expect.stringMatching(/\/api\/v\d\//),
    });
  });

  it('should partially match objects', () => {
    const user = { name: 'Alice', age: 30, role: 'admin', lastLogin: new Date() };

    expect(user).toEqual(
      expect.objectContaining({ name: 'Alice', role: 'admin' })
    );
  });

  it('should match array subsets', () => {
    expect([1, 2, 3, 4, 5]).toEqual(expect.arrayContaining([2, 4]));
    expect(['a', 'b', 'c']).toEqual(expect.arrayContaining(['b']));
  });

  it('should combine asymmetric matchers', () => {
    const response = {
      status: 200,
      data: {
        users: [
          { id: 1, name: 'Alice', email: 'alice@test.com' },
          { id: 2, name: 'Bob', email: 'bob@test.com' },
        ],
      },
    };

    expect(response).toEqual({
      status: 200,
      data: {
        users: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            email: expect.stringContaining('@'),
          }),
        ]),
      },
    });
  });
});

describe('Soft Assertions', () => {
  it('should collect all soft failures', () => {
    const user = { name: 'Alice', age: 30, role: 'admin' };

    expect.soft(user.name).toBe('Alice');
    expect.soft(user.age).toBe(30);
    expect.soft(user.role).toBe('admin');
  });
});

describe('Custom Matchers', () => {
  beforeAll(() => {
    expect.extend({
      toBeWithinRange(received: number, floor: number, ceiling: number) {
        const pass = received >= floor && received <= ceiling;
        return {
          pass,
          message: () =>
            `expected ${received} to be within [${floor}, ${ceiling}]`,
        };
      },

      toBeValidEmail(received: string) {
        const pass = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(received);
        return {
          pass,
          message: () => `expected "${received}" to be a valid email`,
        };
      },
    });
  });

  it('should use toBeWithinRange', () => {
    expect(7).toBeWithinRange(1, 10);
    expect(15).not.toBeWithinRange(1, 10);
  });

  it('should use toBeValidEmail', () => {
    expect('alice@test.com').toBeValidEmail();
    expect('not-an-email').not.toBeValidEmail();
  });
});

interface CustomMatchers<R = unknown> {
  toBeWithinRange(floor: number, ceiling: number): R;
  toBeValidEmail(): R;
}

declare module 'vitest' {
  interface Assertion<T = unknown> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
