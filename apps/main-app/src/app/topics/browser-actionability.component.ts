import { Component } from '@angular/core';
import { CodeBlockComponent } from '../shared/code-block.component';
import { RunHintComponent } from '../shared/run-hint.component';

@Component({
  selector: 'app-browser-actionability',
  imports: [CodeBlockComponent, RunHintComponent],
  template: `
    <h2 class="topic-header">Actionability & False Negatives</h2>
    <p class="topic-subtitle">
      A false negative is a test that passes when the app is actually broken.
      Vitest's full browser mode prevents this by using Playwright's
      <strong>actionability checks</strong> before every interaction.
    </p>

    <div class="topic-section">
      <h3>The CSS bug scenario</h3>
      <p>
        A component's CSS clips its content — the "Add to Cart" button is invisible
        to the user. But the element still exists in the DOM, so a partial-mode test
        happily clicks it and passes.
      </p>
      <app-code-block [code]="cssBug" title="A CSS bug that hides buttons" />
    </div>

    <div class="topic-section">
      <h3>Partial mode: false negative</h3>
      <p>
        Testing Library's <code>userEvent</code> checks if the element is disabled
        or explicitly hidden (<code>display: none</code>), but doesn't verify
        whether it's actually visible on screen.
      </p>
      <app-code-block [code]="falseNegative" />
    </div>

    <div class="topic-section">
      <h3>Full mode: correct failure</h3>
      <p>
        Vitest's <code>userEvent</code> (backed by Playwright) computes the
        element's coordinates and checks if it would actually receive the click.
        If another element intercepts, the test fails with a clear message.
      </p>
      <app-code-block [code]="correctFailure" />
    </div>

    <div class="topic-section">
      <h3>What Playwright checks</h3>
      <app-code-block [code]="actionabilityList" />
    </div>

    <div class="topic-section">
      <h3>Real-world examples</h3>
      <app-code-block [code]="realWorld" />
    </div>

    <div class="topic-section">
      <h3>Side-by-side</h3>
      <div class="comparison-grid">
        <div>
          <h4>Partial (passes incorrectly)</h4>
          <app-code-block [code]="partialSide" />
        </div>
        <div>
          <h4>Full (fails correctly)</h4>
          <app-code-block [code]="fullSide" />
        </div>
      </div>
    </div>

    <div class="note-box">
      <strong>The takeaway</strong>
      If a real user can't click it, your test shouldn't either.
      Full browser mode aligns your tests with actual user experience —
      CSS bugs, overlapping modals, and invisible buttons are caught automatically.
    </div>

    <app-run-hint command="npm run test:browser -- --testFiles=actionability" />
  `,
  styles: `
    code {
      padding: 2px 6px;
      border-radius: 4px;
      background-color: var(--mat-sys-surface-container);
      font-family: 'Roboto Mono', monospace;
      font-size: 0.85em;
    }
  `,
})
export class BrowserActionabilityComponent {
  protected cssBug = `/* A component card with fixed height and overflow hidden */
.cookbook-card {
  height: 120px;
  overflow: hidden;   /* clips everything beyond 120px */
}

/* The card content is taller than 120px:
   ┌──────────────────────┐
   │  Title               │
   │  Description...      │  ← visible area (120px)
   │  Price               │
   ├ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤
   │  [Add to Cart]       │  ← clipped! invisible to user
   └──────────────────────┘
*/`;

  protected falseNegative = `// Partial mode — Testing Library userEvent
import { userEvent } from '@testing-library/user-event';

it('should add to cart', async () => {
  const btn = screen.getByRole('button', { name: 'Add to Cart' });

  // Testing Library checks:
  // ✓ element exists in DOM
  // ✓ element is not disabled
  // ✓ element is not display:none
  // ✗ does NOT check if element is visually clipped
  // ✗ does NOT check if element is covered

  await userEvent.click(btn);

  // TEST PASSES — but the user can't actually see or click the button!
  expect(cart.items()).toHaveLength(1);
});`;

  protected correctFailure = `// Full mode — Vitest browser userEvent
import { page, userEvent } from 'vitest/browser';

it('should add to cart', async () => {
  const btn = page.getByRole('button', { name: 'Add to Cart' });

  // Playwright computes the click point coordinates and checks:
  // ✓ element is visible
  // ✓ element is stable (not mid-animation)
  // ✓ element is enabled
  // ✓ element receives events at the computed point
  // ✗ FAIL — another element intercepts the pointer event

  await userEvent.click(btn);
  // Error: locator.click: <button>Add to Cart</button>
  //   intercepts pointer events.
  //   Retrying... (timeout 5000ms)
});`;

  protected actionabilityList = `// Before every interaction, Playwright verifies:

// 1. VISIBLE
//    Element has non-zero size and is not hidden by
//    display:none, visibility:hidden, or opacity:0

// 2. STABLE
//    Element is not mid-animation (bounding box is
//    consistent across two animation frames)

// 3. ENABLED
//    Element is not disabled (no "disabled" attribute
//    on <button>, <input>, <select>)

// 4. RECEIVES EVENTS
//    Element is the hit target at the action point.
//    No other element is covering it (overlays, modals,
//    overflow clips, z-index stacking)

// 5. EDITABLE (for fill/type)
//    Element is an <input>, <textarea>, or has
//    contenteditable="true"`;

  protected realWorld = `// Modal overlay blocking content
// → Playwright detects the overlay intercepts clicks

// Tooltip covering a button
// → Playwright waits for tooltip to disappear

// Element still animating into position
// → Playwright waits for stable bounding box

// Responsive layout pushing button off-screen
// → Playwright detects element has zero intersection

// Cookie banner covering "Accept" button
// → Playwright reports the banner as intercepting`;

  protected partialSide = `// import from Testing Library
import { userEvent }
  from '@testing-library/user-event';

// Click dispatches JS event directly
await userEvent.click(btn);
// ✓ Test passes

// But the button is clipped by CSS
// and invisible to the user.
// This is a FALSE NEGATIVE.`;

  protected fullSide = `// import from vitest/browser
import { userEvent }
  from 'vitest/browser';

// Click goes through Playwright CDP
await userEvent.click(btn);
// ✗ Test fails

// Playwright detects another element
// intercepts the click at the
// computed coordinates.
// This is the CORRECT result.`;
}
