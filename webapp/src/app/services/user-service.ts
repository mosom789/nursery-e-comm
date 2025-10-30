import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { User } from "../types/user";

@Injectable({ providedIn: "root" })
export class UserService {
  http = inject(HttpClient);
  baseUrl = `${environment.apiUrl}/user`;

  getUsers() {
    return this.http.get<{ users: User[] }>(this.baseUrl);
  }

  updateUser(id: string, data: any) {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  deleteUser(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}

