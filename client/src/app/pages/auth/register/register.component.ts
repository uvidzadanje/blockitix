import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreateUser, Role } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup = new FormGroup({
    role: new FormControl(null, [Validators.required]),
    username: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(40)])
  })

  roles: Array<{key: number, value: string}> = Object.keys(Role).filter(role => !isNaN(Number(role))).map(role => Number(role)).map(key => ({key: key, value: Role[key]}));

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  async register() {
    this.authService.register(this.form.value);
    this.router.navigate(['events']);
  }

}
