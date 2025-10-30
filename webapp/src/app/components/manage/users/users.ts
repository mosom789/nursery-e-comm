import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user-service';
import { User } from '../../../types/user';

@Component({
  selector: 'app-user',
  imports: [FormsModule,CommonModule],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class Users {

  userService = inject(UserService)

  users: User[] = [];

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe((res) => {
      this.users = res.users || [];
    });
  }

  updateUser(user: User) {
    this.userService.updateUser(user._id, { isAdmin: user.isAdmin }).subscribe(() => {
      alert("User updated successfully");
    });
  }

  deleteUser(userId: string) {
    if (confirm("Are you sure you want to delete this user?")) {
      this.userService.deleteUser(userId).subscribe(() => {
        this.users = this.users.filter((u) => u._id !== userId);
        alert("User deleted successfully");
      });
    }
  }
}
