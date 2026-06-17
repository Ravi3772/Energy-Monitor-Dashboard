import { Component, Input } from '@angular/core';

/**
 * Vector monitor icon — avoids Material Icons font baseline issues with "monitoring".
 */
@Component({
  selector: 'app-operator-monitor-icon',
  standalone: true,
  template: `
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      [attr.width]="px"
      [attr.height]="px"
    >
      <path
        fill="currentColor"
        d="M20 3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h6v2H8v2h8v-2h-2v-2h6c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 13H4V5h16v11z"
      />
    </svg>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        line-height: 0;
      }
      svg {
        display: block;
      }
    `,
  ],
})
export class OperatorMonitorIconComponent {
  /** Pixel size; icon is drawn on a 24×24 grid and scales cleanly. */
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  get px(): number {
    switch (this.size) {
      case 'sm':
        return 16;
      case 'lg':
        return 22;
      default:
        return 20;
    }
  }
}
