import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user-service';
import { User } from '../../../types/user';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class Users implements OnInit, OnDestroy {
  users: User[] = [];
  isLoading = true;
  error: string | null = null;

  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

  ngOnInit() {
    console.log('Users component ngOnInit called');
    console.log('UserService exists:', !!this.userService);
    
    setTimeout(() => {
      this.loadUsers();
    }, 0);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUsers() {
    console.log('Loading users...');
    this.isLoading = true;
    this.error = null;

    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          console.log('✅ Users response received:', res);
          console.log('Users array:', res.users);
          console.log('Number of users:', res.users?.length);

          this.users = res.users || [];
          
          console.log('Users assigned:', this.users.length);

          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('❌ Error loading users:', error);
          console.error('Error details:', {
            message: error.message,
            status: error.status,
            statusText: error.statusText,
            url: error.url,
            error: error.error
          });

          this.error = 'Failed to load users. Please try again.';
          this.isLoading = false;
          this.users = [];
          this.cdr.detectChanges();
        },
        complete: () => {
          console.log('Users loading completed');
        }
      });
  }

  updateUser(user: User) {
    console.log('Updating user:', user._id, 'isAdmin:', user.isAdmin);

    this.userService.updateUser(user._id, { isAdmin: user.isAdmin })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('✅ User updated successfully:', response);
          alert('User updated successfully');
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('❌ Error updating user:', error);
          alert('Failed to update user. Please try again.');
          // Reload users to revert UI changes
          this.loadUsers();
        }
      });
  }

  deleteUser(userId: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      console.log('Deleting user:', userId);

      this.userService.deleteUser(userId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            console.log('✅ User deleted successfully:', response);
            
            // Remove from local array
            this.users = this.users.filter((u) => u._id !== userId);
            this.cdr.detectChanges();
            
            alert('User deleted successfully');
          },
          error: (error) => {
            console.error('❌ Error deleting user:', error);
            alert('Failed to delete user. Please try again.');
          }
        });
    }
  }

  retryLoading() {
    this.loadUsers();
  }
}
