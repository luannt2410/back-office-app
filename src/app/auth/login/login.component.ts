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
  ERROR_ENTER_USERNAME = 0;
  ERROR_ENTER_PASSWORD = 1;
  ERROR_ENTER_USERNAME_PASSWORD = 2;
  ERROR_SERVER = 3;
  ERROR_WRONG_USERNAME_PASSWORD = 4;
  ERROR_PASSWORD_SHORT = 7;
  ERROR_ENTER_INFO = 8;
  ERROR_PASS_NOT_MATCH = 9;
  ERROR_USER_NAME_EXIST = 10;
  LOGIN_OK = 5;
  onShowLogin: boolean;
  onShowRegister: boolean;
  errorLogin: number;
  btnRegisterShow: boolean;
  btnLoginShow: boolean;
  errorRegister: number;
  userNameLogin: any;
  userPasswordLogin: any;
  userNameRegister: any;
  passWordRegister: any;
  confirmPassWordRegister: any;
  emailRegister: any;
  fullnameRegister: any;
  REGISTER_SUCCESS = 11;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  loginForm = (new FormBuilder()).group({
    username: ['', Validators.compose([Validators.required])],
    password: ['', Validators.required]
  });

  registerForm = (new FormBuilder()).group({
    username: ['', Validators.compose([Validators.required])],
    password: ['', Validators.required],
    passwordconfirm: ['', Validators.required],
    email: ['', Validators.required],
    fullname: ['', Validators.required],
  });

  message = '';

  ngOnInit() {
    this.onShowLogin = true;
    this.btnRegisterShow = true;
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

  register() {
    const userInput = this.registerForm.value;

    if (_.isEmpty(userInput.username) || _.isEmpty(userInput.password) || _.isEmpty(userInput.passwordconfirm)
      || _.isEmpty(userInput.email || _.isEmpty(userInput.fullname))
      ) {
      this.errorRegister = this.ERROR_ENTER_INFO;
    } else if (userInput.password.length < 8 || userInput.passwordconfirm.length < 8) {
      this.errorRegister = this.ERROR_PASSWORD_SHORT;
    } else {

      const data = {
        username: userInput.username,
        password: userInput.password,
        email: userInput.email,
        fullname: userInput.fullname,
      };
      this.errorRegister = null;
      this.authService.Register(data).subscribe((response: any) => {
        if (response.msg === 0) {
          this.errorRegister = this.ERROR_USER_NAME_EXIST;
        } else {
          this.userNameRegister = '';
          this.passWordRegister = '';
          this.confirmPassWordRegister = '';
          this.emailRegister = '';
          this.fullnameRegister = '';
          this.errorRegister = this.REGISTER_SUCCESS;
        }
      }, (e) => {
        if (e.status === 0) {
          this.errorRegister = this.ERROR_SERVER;
        }
      });
    }
  }

  showRegister() {
    this.onShowRegister = true;
    this.onShowLogin = false;
    this.btnRegisterShow = false;
    this.btnLoginShow = true;
    this.userNameRegister = '';
    this.passWordRegister = '';
    this.confirmPassWordRegister = '';
    this.emailRegister = '';
    this.fullnameRegister = '';
    this.errorLogin = null;
  }

  showLogin() {
    this.userNameLogin = '';
    this.userPasswordLogin = '';
    this.errorLogin = null;
    this.onShowRegister = false;
    this.onShowLogin = true;
    this.btnRegisterShow = true;
    this.btnLoginShow = false;
  }
}
