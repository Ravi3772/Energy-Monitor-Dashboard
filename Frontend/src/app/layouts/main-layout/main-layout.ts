import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { NavbarComponent } from '../../components/navbar/navbar';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterModule, SidebarComponent, NavbarComponent, CommonModule],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.css'],
})
export class MainLayoutComponent {
  protected readonly layout = inject(LayoutService);
}