import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService, HttpError } from '../shared';
import * as _ from 'lodash';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  ERROR_ENTER_USERNAME =  0;
  ERROR_ENTER_PASSWORD = 1;
  ERROR_ENTER_USERNAME_PASSWORD = 2;
  ERROR_SERVER = 3;
  ERROR_WRONG_USERNAME_PASSWORD = 4;
  LOGIN_OK = 5;

  errorLogin: number;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  loginForm = (new FormBuilder()).group({
    username: ['', Validators.compose([Validators.required])],
    password: ['', Validators.required]
  });

  message = '';

  ngOnInit() {

  }

  login() {
    const redirect = '/default';
    const query = this.route.snapshot.queryParamMap;
    const userInput = this.loginForm.value;
    const data = {
      username: userInput.username,
      password: userInput.password,
    };

    if (_.isEmpty(userInput.username) && !_.isEmpty(userInput.password)) {
      this.errorLogin = this.ERROR_ENTER_USERNAME;
    } else if (_.isEmpty(userInput.password) && !_.isEmpty(userInput.username)) {
      this.errorLogin = this.ERROR_ENTER_PASSWORD;
    } else if (_.isEmpty(userInput.username) && _.isEmpty(userInput.password)) {
      this.errorLogin = this.ERROR_ENTER_USERNAME_PASSWORD;
    } else {
      this.authService.Login(data).subscribe((v) => {
        if (v.user.username != null) {
          this.errorLogin = this.LOGIN_OK;
          this.router.navigateByUrl('default');
        } else {
          this.router.navigateByUrl('');
        }
      }, (e) => {
        if (e.status === 0) {
          this.errorLogin = this.ERROR_SERVER;
        } else {
          this.errorLogin = this.ERROR_WRONG_USERNAME_PASSWORD;
        }
      });
    }
  }
}
