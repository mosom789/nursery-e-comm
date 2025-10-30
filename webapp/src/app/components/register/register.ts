import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/authService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [MatInputModule,MatButtonModule,ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {

  formbuilder = inject(FormBuilder);
  registerForm = this.formbuilder.group({
    name:['',[Validators.required]],
    email:['',[Validators.required,Validators.email]],
    password:['',[Validators.required,Validators.minLength(6)]],
  });

  authService = inject(AuthService)
  router = inject(Router);
  
  register(){
    let value = this.registerForm.value;
    this.authService.register(value.name!,value.email!,value.password!).subscribe(result=>{
      alert("User registered")
      this.router.navigateByUrl('/login')
    })
  }

}
