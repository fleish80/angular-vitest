import { expectTypeOf } from 'vitest';

describe('Basic Type Assertions', () => {
  it('should verify primitive types', () => {
    expectTypeOf('hello').toBeString();
    expectTypeOf(42).toBeNumber();
    expectTypeOf(true).toBeBoolean();
    expectTypeOf(null).toBeNull();
    expectTypeOf(undefined).toBeUndefined();
    expectTypeOf({ a: 1 }).toBeObject();
    expectTypeOf([1, 2]).toBeArray();
  });

  it('should verify specific type shapes', () => {
    const config = { debug: true, port: 3000 };
    expectTypeOf(config).toEqualTypeOf<{ debug: boolean; port: number }>();
  });
});

describe('Function Type Assertions', () => {
  it('should verify function signatures', () => {
    const greet = (name: string, age: number): string => `Hello ${name}, you are ${age}`;

    expectTypeOf(greet).toBeFunction();
    expectTypeOf(greet).parameters.toEqualTypeOf<[string, number]>();
    expectTypeOf(greet).returns.toBeString();
    expectTypeOf(greet).toBeCallableWith('Alice', 30);
  });

  it('should verify async function return type', () => {
    const fetchUser = async (id: number): Promise<{ name: string }> => ({ name: 'Test' });

    expectTypeOf(fetchUser).parameters.toEqualTypeOf<[number]>();
    expectTypeOf(fetchUser).returns.resolves.toEqualTypeOf<{ name: string }>();
  });
});

describe('Union & Generic Types', () => {
  it('should verify union types', () => {
    type Status = 'active' | 'inactive' | 'pending';
    const status: Status = 'active';

    expectTypeOf(status).toEqualTypeOf<Status>();
    expectTypeOf<Status>().toMatchTypeOf<string>();
  });

  it('should verify generic containers', () => {
    const numbers: Array<number> = [1, 2, 3];
    expectTypeOf(numbers).toEqualTypeOf<number[]>();

    const map = new Map<string, number>();
    expectTypeOf(map).toEqualTypeOf<Map<string, number>>();
  });
});

describe('Custom Type Utilities', () => {
  type Nullable<T> = T | null | undefined;

  it('should verify Nullable utility type', () => {
    expectTypeOf<Nullable<string>>().toEqualTypeOf<string | null | undefined>();
    expectTypeOf<Nullable<number>>().toEqualTypeOf<number | null | undefined>();
  });

  it('should verify Readonly', () => {
    type Config = { host: string; port: number };
    type ReadonlyConfig = Readonly<Config>;

    expectTypeOf<ReadonlyConfig>().toEqualTypeOf<{
      readonly host: string;
      readonly port: number;
    }>();
  });

  it('should verify Pick and Omit', () => {
    type User = { id: number; name: string; email: string; role: string };

    expectTypeOf<Pick<User, 'id' | 'name'>>().toEqualTypeOf<{
      id: number;
      name: string;
    }>();

    expectTypeOf<Omit<User, 'email' | 'role'>>().toEqualTypeOf<{
      id: number;
      name: string;
    }>();
  });
});
