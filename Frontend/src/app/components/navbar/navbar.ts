import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminOperatorService } from '../../services/admin-operator.service';
import { OperatorMonitorIconComponent } from '../operator-monitor-icon/operator-monitor-icon';
import { LayoutService } from '../../services/layout.service';
import { getApiErrorMessage } from '../../services/api.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, OperatorMonitorIconComponent],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class NavbarComponent {
  protected readonly auth = inject(AuthService);
  protected readonly layout = inject(LayoutService);
  private readonly router = inject(Router);
  private readonly adminOperators = inject(AdminOperatorService);

  addOperatorOpen = signal(false);
  newOperatorUsername = '';
  newOperatorPassword = '';
  addOperatorBusy = signal(false);
  addOperatorError = signal<string | null>(null);
  addOperatorSuccess = signal<string | null>(null);

  signOut(): void {
    this.auth.signOut();
    void this.router.navigateByUrl('/login');
  }

  toggleAddOperator(): void {
    this.addOperatorOpen.update((v) => !v);
    this.addOperatorError.set(null);
    this.addOperatorSuccess.set(null);
  }

  closeAddOperator(): void {
    this.addOperatorOpen.set(false);
    this.addOperatorError.set(null);
  }

  async createOperator(): Promise<void> {
    this.addOperatorError.set(null);
    this.addOperatorSuccess.set(null);
    const u = this.newOperatorUsername.trim();
    if (!u || !this.newOperatorPassword) {
      this.addOperatorError.set('Enter username and password.');
      return;
    }
    if (this.newOperatorPassword.length < 8) {
      this.addOperatorError.set('Password must be at least 8 characters.');
      return;
    }
    this.addOperatorBusy.set(true);
    try {
      const created = await this.adminOperators.createOperator(u, this.newOperatorPassword);
      this.addOperatorSuccess.set(`Operator “${created.username}” created.`);
      this.newOperatorUsername = '';
      this.newOperatorPassword = '';
    } catch (e) {
      this.addOperatorError.set(getApiErrorMessage(e, 'Could not create operator.'));
    } finally {
      this.addOperatorBusy.set(false);
    }
  }
}
