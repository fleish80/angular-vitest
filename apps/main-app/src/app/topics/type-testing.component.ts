import { Component } from '@angular/core';
import { CodeBlockComponent } from '../shared/code-block.component';
import { RunHintComponent } from '../shared/run-hint.component';

@Component({
  selector: 'app-type-testing',
  imports: [CodeBlockComponent, RunHintComponent],
  template: `
    <h2 class="topic-header">Type Testing</h2>
    <p class="topic-subtitle">
      Vitest can test your TypeScript types at compile time — no runtime execution needed.
      Catch type regressions before they reach production.
    </p>

    <div class="topic-section">
      <h3>expectTypeOf</h3>
      <p>
        Assert that a value's type matches your expectations. These checks
        happen at the type level and produce no runtime code.
      </p>
      <app-code-block [code]="expectTypeOfCode" />
    </div>

    <div class="topic-section">
      <h3>Function type assertions</h3>
      <p>
        Verify function signatures — parameter types, return types, and generics.
      </p>
      <app-code-block [code]="functionTypes" />
    </div>

    <div class="topic-section">
      <h3>Asserting generics and unions</h3>
      <app-code-block [code]="genericTypes" />
    </div>

    <div class="topic-section">
      <h3>Testing type utilities</h3>
      <p>
        Perfect for verifying custom type utilities, mapped types, and conditional types.
      </p>
      <app-code-block [code]="utilityTypes" />
    </div>

    <div class="note-box">
      <strong>How it works</strong>
      Type tests use TypeScript's type checker at build/test time.
      They don't produce runtime assertions — they're purely compile-time checks.
      If a type assertion fails, you get a TypeScript error, not a runtime error.
    </div>

    <app-run-hint command="npx nx test main-app type-testing" />
  `,
})
export class TypeTestingComponent {
  protected expectTypeOfCode = `import { expectTypeOf } from 'vitest';

it('should verify basic types', () => {
  expectTypeOf('hello').toBeString();
  expectTypeOf(42).toBeNumber();
  expectTypeOf(true).toBeBoolean();
  expectTypeOf(null).toBeNull();
  expectTypeOf(undefined).toBeUndefined();
  expectTypeOf({ a: 1 }).toBeObject();
  expectTypeOf([1, 2]).toBeArray();
});

it('should verify specific types', () => {
  const name = 'Alice';
  expectTypeOf(name).toEqualTypeOf<string>();

  const config = { debug: true, port: 3000 };
  expectTypeOf(config).toEqualTypeOf<{ debug: boolean; port: number }>();
});`;

  protected functionTypes = `it('should verify function signatures', () => {
  const greet = (name: string, age: number) => \`Hello \${name}\`;

  expectTypeOf(greet).toBeFunction();
  expectTypeOf(greet).parameters.toEqualTypeOf<[string, number]>();
  expectTypeOf(greet).returns.toBeString();

  // Verify it's callable with specific args
  expectTypeOf(greet).toBeCallableWith('Alice', 30);
});`;

  protected genericTypes = `it('should verify union types', () => {
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
});`;

  protected utilityTypes = `// Test your own type utilities
type Nullable<T> = T | null | undefined;

it('should verify custom type utilities', () => {
  expectTypeOf<Nullable<string>>()
    .toEqualTypeOf<string | null | undefined>();
});

type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? DeepReadonly<T[K]>
    : T[K];
};

it('should verify DeepReadonly', () => {
  type Input = { a: { b: string } };
  type Expected = { readonly a: { readonly b: string } };

  expectTypeOf<DeepReadonly<Input>>().toEqualTypeOf<Expected>();
});`;
}
