import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboard implements OnInit {
  http = inject(HttpClient);
  stats = { categories: 0, products: 0, brands: 0, orders: 0 };

  ngOnInit() {
    this.loadDashboardStats();
  }

  loadDashboardStats() {
    this.http.get(`${environment.apiUrl}/stats`).subscribe({
      next: (data: any) => (this.stats = data),
      error: (err) => console.error('Error loading stats:', err),
    });
  }
}

