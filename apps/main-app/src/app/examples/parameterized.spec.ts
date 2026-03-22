export {};

function add(a: number, b: number): number {
  return a + b;
}

function isBlank(value: string | null | undefined): boolean {
  return value == null || value.trim().length === 0;
}

function getPermissions(role: string): { canEdit: boolean; canDelete: boolean } {
  switch (role) {
    case 'admin':
      return { canEdit: true, canDelete: true };
    case 'editor':
      return { canEdit: true, canDelete: false };
    default:
      return { canEdit: false, canDelete: false };
  }
}

describe('it.each with arrays', () => {
  it.each([
    [1, 1, 2],
    [1, 2, 3],
    [2, 2, 4],
    [5, 5, 10],
    [0, 0, 0],
    [-1, 1, 0],
  ])('add(%i, %i) should return %i', (a, b, expected) => {
    expect(add(a, b)).toBe(expected);
  });
});

describe('it.each with objects', () => {
  it.each([
    { input: '' as string | null | undefined, expected: true, desc: 'empty string' },
    { input: '  ' as string | null | undefined, expected: true, desc: 'whitespace' },
    { input: 'hello' as string | null | undefined, expected: false, desc: 'non-empty string' },
    { input: undefined as string | null | undefined, expected: true, desc: 'undefined' },
    { input: null as string | null | undefined, expected: true, desc: 'null' },
  ])('isBlank($desc) → $expected', ({ input, expected }) => {
    expect(isBlank(input)).toBe(expected);
  });
});

describe('it.each with template literals', () => {
  it.each`
    a     | b     | expected
    ${1}  | ${1}  | ${2}
    ${2}  | ${3}  | ${5}
    ${10} | ${20} | ${30}
  `('$a + $b = $expected', ({ a, b, expected }) => {
    expect(add(a, b)).toBe(expected);
  });
});

describe.each([
  { role: 'admin', canEdit: true, canDelete: true },
  { role: 'editor', canEdit: true, canDelete: false },
  { role: 'viewer', canEdit: false, canDelete: false },
])('permissions for $role', ({ role, canEdit, canDelete }) => {
  it(`canEdit should be ${canEdit}`, () => {
    expect(getPermissions(role).canEdit).toBe(canEdit);
  });

  it(`canDelete should be ${canDelete}`, () => {
    expect(getPermissions(role).canDelete).toBe(canDelete);
  });
});

describe('Fibonacci it.each', () => {
  function fibonacci(n: number): number {
    if (n <= 1) return n;
    let a = 0,
      b = 1;
    for (let i = 2; i <= n; i++) {
      [a, b] = [b, a + b];
    }
    return b;
  }

  it.each([
    { n: 0, expected: 0 },
    { n: 1, expected: 1 },
    { n: 2, expected: 1 },
    { n: 5, expected: 5 },
    { n: 10, expected: 55 },
  ])('fibonacci($n) = $expected', ({ n, expected }) => {
    expect(fibonacci(n)).toBe(expected);
  });
});
