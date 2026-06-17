import { Injectable, signal } from '@angular/core';

const MOBILE_MAX = 900;

@Injectable({ providedIn: 'root' })
export class LayoutService {
  /** Desktop: narrow rail with icons only. */
  readonly sidebarCollapsed = signal(false);

  /** Small screens: slide-out drawer. */
  readonly mobileDrawerOpen = signal(false);

  readonly isMobileView = signal(
    typeof window !== 'undefined' ? window.innerWidth <= MOBILE_MAX : false,
  );

  constructor() {
    if (typeof window === 'undefined') {
      return;
    }
    window.addEventListener('resize', () => {
      const mobile = window.innerWidth <= MOBILE_MAX;
      this.isMobileView.set(mobile);
      if (!mobile) {
        this.mobileDrawerOpen.set(false);
      }
    });
  }

  toggleMenu(): void {
    if (this.isMobileView()) {
      this.mobileDrawerOpen.update((v) => !v);
    } else {
      this.sidebarCollapsed.update((v) => !v);
    }
  }

  closeMobileDrawer(): void {
    this.mobileDrawerOpen.set(false);
  }
}
