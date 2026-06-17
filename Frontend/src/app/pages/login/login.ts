import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, UserRole } from '../../services/auth.service';
import { OperatorMonitorIconComponent } from '../../components/operator-monitor-icon/operator-monitor-icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, OperatorMonitorIconComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  readonly roles: readonly {
    id: UserRole;
    label: string;
    description: string;
    /** Material icon name; operator uses SVG instead of font glyph. */
    icon?: string;
  }[] = [
    {
      id: 'admin',
      label: 'Admin',
      description: 'Full system access and configuration',
      icon: 'admin_panel_settings',
    },
    {
      id: 'operator',
      label: 'Operator',
      description: 'Monitor energy usage and analytics',
    },
  ];

  selectedRole = signal<UserRole | null>(null);
  username = '';
  password = '';
  errorMessage = signal<string | null>(null);
  submitting = signal(false);

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  selectRole(role: UserRole): void {
    this.selectedRole.set(role);
    this.errorMessage.set(null);
  }

  async submit(): Promise<void> {
    const role = this.selectedRole();
    if (!role) {
      this.errorMessage.set('Select your role to continue.');
      return;
    }
    if (!this.username.trim() || !this.password) {
      this.errorMessage.set('Enter your username and password.');
      return;
    }
    this.errorMessage.set(null);
    this.submitting.set(true);
    try {
      await this.auth.signIn(role, this.username.trim(), this.password);
      await this.router.navigateByUrl('/');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Sign in failed.';
      this.errorMessage.set(msg);
    } finally {
      this.submitting.set(false);
    }
  }
}
