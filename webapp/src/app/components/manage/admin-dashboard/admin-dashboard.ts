import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../../environments/environment';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboard implements OnInit, OnDestroy {
  stats = { 
    categories: 0, 
    products: 0, 
    brands: 0, 
    orders: 0,
    users: 0,
    revenue: 0
  };
  isLoading = true;
  error: string | null = null;

  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

  ngOnInit() {
    console.log('AdminDashboard ngOnInit called');
    console.log('Environment API URL:', environment.apiUrl);
    
    setTimeout(() => {
      this.loadDashboardStats();
    }, 0);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDashboardStats() {
    console.log('Loading dashboard stats...');
    this.isLoading = true;
    this.error = null;

    this.http.get<any>(`${environment.apiUrl}/stats`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log('✅ Dashboard stats received:', data);
          
          this.stats = {
            categories: data.categories || 0,
            products: data.products || 0,
            brands: data.brands || 0,
            orders: data.orders || 0,
            users: data.users || 0,
            revenue: data.revenue || 0
          };

          console.log('Stats assigned:', this.stats);

          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('❌ Error loading stats:', err);
          console.error('Error details:', {
            message: err.message,
            status: err.status,
            statusText: err.statusText,
            url: err.url,
            error: err.error
          });

          this.error = 'Failed to load dashboard statistics. Please try again.';
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        complete: () => {
          console.log('Dashboard stats loading completed');
        }
      });
  }

  retryLoading() {
    this.loadDashboardStats();
  }
}
