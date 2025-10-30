import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Order } from '../types/order';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
   http = inject(HttpClient);
   baseUrl = `${environment.apiUrl}/order`;

  getStats() {
  return this.http.get(environment.apiUrl +'/stats');
  }
  
  getAdminOrder(){
    return this.http.get<Order[]>(environment.apiUrl + '/order')
  }

  updateOrder(id: any, data: any) {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  deleteOrder(id: any) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

}
