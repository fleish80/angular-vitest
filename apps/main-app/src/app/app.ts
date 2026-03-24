import { Component, signal, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

@Component({
  imports: [
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
  ],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected sidenavOpened = signal(true);

  protected sections: NavSection[] = [
    {
      title: 'Getting Started',
      items: [
        { label: 'Introduction', route: '/', icon: 'home' },
        { label: 'Why Vitest?', route: '/why-vitest', icon: 'lightbulb' },
        { label: 'Karma vs Vitest', route: '/karma-vs-vitest', icon: 'compare_arrows' },
        { label: 'Running Tests', route: '/running-tests', icon: 'terminal' },
      ],
    },
    {
      title: 'Core Features',
      items: [
        { label: 'Basic Tests', route: '/basic-tests', icon: 'play_arrow' },
        { label: 'Matchers', route: '/matchers', icon: 'check_circle' },
        { label: 'Mocking', route: '/mocking', icon: 'content_copy' },
        { label: 'Fake Timers', route: '/fake-timers', icon: 'timer' },
        { label: 'Snapshots', route: '/snapshots', icon: 'photo_camera' },
        { label: 'Parameterized', route: '/parameterized', icon: 'view_list' },
        { label: 'Filtering & Concurrent', route: '/filtering', icon: 'filter_list' },
        { label: 'Type Testing', route: '/type-testing', icon: 'code' },
      ],
    },
    {
      title: 'Angular Integration',
      items: [
        { label: 'Component Testing', route: '/angular-components', icon: 'widgets' },
        { label: 'Service Testing', route: '/angular-services', icon: 'settings' },
      ],
    },
    {
      title: 'Browser Mode',
      items: [
        { label: 'Introduction', route: '/browser-intro', icon: 'web' },
        { label: 'Configuration', route: '/browser-config', icon: 'build' },
        { label: 'Partial vs Full Mode', route: '/browser-full-mode', icon: 'swap_horiz' },
        { label: 'Locators', route: '/browser-locators', icon: 'search' },
        { label: 'Interactions', route: '/browser-interactions', icon: 'touch_app' },
        { label: 'Real DOM', route: '/browser-dom', icon: 'dns' },
        { label: 'Polling & Retries', route: '/browser-polling', icon: 'hourglass_empty' },
        { label: 'Component Testing', route: '/browser-component-testing', icon: 'widgets' },
        { label: 'Web APIs', route: '/browser-web-apis', icon: 'api' },
        { label: 'Actionability', route: '/browser-actionability', icon: 'verified' },
        { label: 'Debugging & Traces', route: '/browser-debugging', icon: 'bug_report' },
      ],
    },
    {
      title: 'Tooling & Migration',
      items: [
        { label: 'Vitest UI & DX', route: '/vitest-ui', icon: 'dashboard' },
        { label: 'Migration Path', route: '/browser-migration', icon: 'moving' },
      ],
    },
  ];

  constructor(breakpointObserver: BreakpointObserver) {
    breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.sidenavOpened.set(!result.matches);
    });
  }
}
