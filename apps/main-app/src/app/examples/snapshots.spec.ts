describe('File Snapshots', () => {
  it('should snapshot a config object', () => {
    const config = {
      apiUrl: 'https://api.example.com',
      retries: 3,
      timeout: 5000,
      features: ['auth', 'logging', 'cache'],
    };

    expect(config).toMatchSnapshot();
  });

  it('should snapshot an array of items', () => {
    const items = [
      { id: 1, name: 'Item A', active: true },
      { id: 2, name: 'Item B', active: false },
      { id: 3, name: 'Item C', active: true },
    ];

    expect(items).toMatchSnapshot();
  });
});

describe('Inline Snapshots', () => {
  function formatGreeting(name: string, timeOfDay: string): string {
    return `Good ${timeOfDay}, ${name}!`;
  }

  it('should match an inline snapshot', () => {
    expect(formatGreeting('Alice', 'morning')).toMatchInlineSnapshot(
      `"Good morning, Alice!"`
    );
  });

  it('should snapshot multiple values inline', () => {
    expect(formatGreeting('Bob', 'afternoon')).toMatchInlineSnapshot(
      `"Good afternoon, Bob!"`
    );

    expect(formatGreeting('Charlie', 'evening')).toMatchInlineSnapshot(
      `"Good evening, Charlie!"`
    );
  });
});

describe('Snapshot with Dynamic Values', () => {
  interface User {
    id: string;
    name: string;
    role: string;
    createdAt: Date;
  }

  function createUser(name: string, role: string): User {
    return {
      id: Math.random().toString(36).substring(7),
      name,
      role,
      createdAt: new Date(),
    };
  }

  it('should snapshot with asymmetric matchers for dynamic fields', () => {
    const user = createUser('Bob', 'admin');

    expect(user).toMatchSnapshot({
      id: expect.any(String),
      createdAt: expect.any(Date),
    });
  });
});

describe('Snapshot of Strings', () => {
  it('should snapshot multi-line HTML', () => {
    const html = `
<div class="card">
  <h2>Product Name</h2>
  <p class="price">$29.99</p>
  <button class="add-to-cart">Add to Cart</button>
</div>`.trim();

    expect(html).toMatchSnapshot();
  });

  it('should snapshot JSON output', () => {
    const data = { users: 42, active: 35, revenue: 9800 };
    const json = JSON.stringify(data, null, 2);

    expect(json).toMatchInlineSnapshot(`
      "{
        "users": 42,
        "active": 35,
        "revenue": 9800
      }"
    `);
  });
});
