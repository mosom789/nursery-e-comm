import { Component, inject, } from '@angular/core';
import { AuthService } from '../../services/authService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer-profile',
  imports: [CommonModule,FormsModule],
  templateUrl: './customer-profile.html',
  styleUrls: ['./customer-profile.scss']
})
export class CustomerProfile {

  authService = inject(AuthService)

   address = {
    fullName: '',
    phone: '',
    street: '',
    city: '',
    pincode: ''
  };

  addressSaved = false;

  // ngOnInit() {
  //   const savedAddress = localStorage.getItem('userAddress');
  //   if (savedAddress) {
  //     this.address = JSON.parse(savedAddress);
  //     this.addressSaved = true;
  //   }
  // }

  // saveAddress() {
  //   localStorage.setItem('userAddress', JSON.stringify(this.address));
  //   this.addressSaved = true;
  //   alert('Address saved successfully!');
  // }

  // editAddress() {
  //   this.addressSaved = false;
  // }

  ngOnInit() {
  const userEmail = this.authService.userEmail; // or userId if available
  const savedAddress = localStorage.getItem(`userAddress_${userEmail}`);
  if (savedAddress) {
    this.address = JSON.parse(savedAddress);
    this.addressSaved = true;
  }
}

saveAddress() {
  const userEmail = this.authService.userEmail; // or userId
  localStorage.setItem(`userAddress_${userEmail}`, JSON.stringify(this.address));
  this.addressSaved = true;
  alert('Address saved successfully!');
}

editAddress() {
  this.addressSaved = false;
}


}
