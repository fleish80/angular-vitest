import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./topics/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'why-vitest',
    loadComponent: () => import('./topics/why-vitest.component').then(m => m.WhyVitestComponent),
  },
  {
    path: 'karma-vs-vitest',
    loadComponent: () => import('./topics/karma-vs-vitest.component').then(m => m.KarmaVsVitestComponent),
  },
  {
    path: 'running-tests',
    loadComponent: () => import('./topics/running-tests.component').then(m => m.RunningTestsComponent),
  },
  {
    path: 'basic-tests',
    loadComponent: () => import('./topics/basic-tests.component').then(m => m.BasicTestsComponent),
  },
  {
    path: 'matchers',
    loadComponent: () => import('./topics/matchers.component').then(m => m.MatchersComponent),
  },
  {
    path: 'mocking',
    loadComponent: () => import('./topics/mocking.component').then(m => m.MockingComponent),
  },
  {
    path: 'fake-timers',
    loadComponent: () => import('./topics/fake-timers.component').then(m => m.FakeTimersComponent),
  },
  {
    path: 'snapshots',
    loadComponent: () => import('./topics/snapshots.component').then(m => m.SnapshotsComponent),
  },
  {
    path: 'parameterized',
    loadComponent: () => import('./topics/parameterized.component').then(m => m.ParameterizedComponent),
  },
  {
    path: 'filtering',
    loadComponent: () => import('./topics/filtering.component').then(m => m.FilteringComponent),
  },
  {
    path: 'type-testing',
    loadComponent: () => import('./topics/type-testing.component').then(m => m.TypeTestingComponent),
  },
  {
    path: 'angular-components',
    loadComponent: () => import('./topics/angular-components.component').then(m => m.AngularComponentsComponent),
  },
  {
    path: 'angular-services',
    loadComponent: () => import('./topics/angular-services.component').then(m => m.AngularServicesComponent),
  },
  {
    path: 'browser-intro',
    loadComponent: () => import('./topics/browser-intro.component').then(m => m.BrowserIntroComponent),
  },
  {
    path: 'browser-config',
    loadComponent: () => import('./topics/browser-config.component').then(m => m.BrowserConfigComponent),
  },
  {
    path: 'browser-locators',
    loadComponent: () => import('./topics/browser-locators.component').then(m => m.BrowserLocatorsComponent),
  },
  {
    path: 'browser-interactions',
    loadComponent: () => import('./topics/browser-interactions.component').then(m => m.BrowserInteractionsComponent),
  },
  {
    path: 'browser-dom',
    loadComponent: () => import('./topics/browser-dom.component').then(m => m.BrowserDomComponent),
  },
  {
    path: 'browser-component-testing',
    loadComponent: () => import('./topics/browser-component-testing.component').then(m => m.BrowserComponentTestingComponent),
  },
  {
    path: 'browser-polling',
    loadComponent: () => import('./topics/browser-polling.component').then(m => m.BrowserPollingComponent),
  },
  {
    path: 'browser-full-mode',
    loadComponent: () => import('./topics/browser-full-mode.component').then(m => m.BrowserFullModeComponent),
  },
  {
    path: 'browser-web-apis',
    loadComponent: () => import('./topics/browser-web-apis.component').then(m => m.BrowserWebApisComponent),
  },
  {
    path: 'browser-actionability',
    loadComponent: () => import('./topics/browser-actionability.component').then(m => m.BrowserActionabilityComponent),
  },
  {
    path: 'browser-debugging',
    loadComponent: () => import('./topics/browser-debugging.component').then(m => m.BrowserDebuggingComponent),
  },
  {
    path: 'browser-migration',
    loadComponent: () => import('./topics/browser-migration.component').then(m => m.BrowserMigrationComponent),
  },
  {
    path: 'vitest-ui',
    loadComponent: () => import('./topics/vitest-ui.component').then(m => m.VitestUiComponent),
  },
];
