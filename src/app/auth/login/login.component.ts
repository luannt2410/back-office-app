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
  ERROR_WRONG_EMAIL = 12;
  EMAIL_HAVE_SEND = 13;
  VALIDATE_CODE_WRONG = 14;
  LOGIN_OK = 5;
  onShowLogin: boolean;
  onShowRegister: boolean;
  errorLogin: number;
  btnRegisterShow: boolean;
  btnLoginShow: boolean;
  errorRegister: number;
  userNameLogin: any;
  userPasswordLogin: any;
  onShowValidateCode: boolean;
  userNameRegister: any;
  passWordRegister: any;
  confirmPassWordRegister: any;
  emailRegister: any;
  fullnameRegister: any;
  REGISTER_SUCCESS = 11;
  inputUserNameRegister: boolean;
  inputPasswordRegister: boolean;
  inputPasswordConfirmRegister: boolean;
  inputEmailRegister: boolean;
  inputFullNameRegister: boolean;
  validateCodeEmail: any;
  showTxtConfirmRegister: boolean;
  valueValidateCodeEmail: any;
  codeFromEmail: any;
  onShowConfirmRegister: boolean;
  inputValidateCode: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
  }

  loginForm = (new FormBuilder()).group({
    username: ['', Validators.compose([Validators.required])],
    password: ['', Validators.required]
  });

  registerForm = (new FormBuilder()).group({
    username: [{ value: '', disabled: this.inputUserNameRegister }, Validators.compose([Validators.required])],
    password: [{ value: '', disabled: this.inputPasswordRegister }, Validators.required],
    passwordconfirm: [{ value: '', disabled: this.inputPasswordConfirmRegister }, Validators.required],
    email: [{ value: '', disabled: this.inputEmailRegister }, Validators.required],
    fullname: [{ value: '', disabled: this.inputFullNameRegister }, Validators.required],
    validatecode: ['', Validators.required]
  });

  confirmForm = (new FormBuilder()).group({
    validatecode: [{ value: '', disabled: this.inputValidateCode }, Validators.compose([Validators.required])],
  });

  message = '';

  ngOnInit() {
    this.onShowLogin = true;
    this.onShowRegister = false;
    this.onShowValidateCode = false;
    this.btnRegisterShow = true;
    this.enableInputRegister();
    this.showTxtConfirmRegister = false;
  }

  enableInputRegister() {
    this.inputUserNameRegister = false;
    this.inputPasswordRegister = false;
    this.inputPasswordConfirmRegister = false;
    this.inputFullNameRegister = false;
    this.inputEmailRegister = false;
  }

  disabledInputRegister() {
    this.inputUserNameRegister = true;
    this.inputPasswordRegister = true;
    this.inputPasswordConfirmRegister = true;
    this.inputFullNameRegister = true;
    this.inputEmailRegister = true;
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
    const data = {
      username: userInput.username,
      password: userInput.password,
      email: userInput.email,
      fullname: userInput.fullname
    };
    if (_.isEmpty(userInput.username) || _.isEmpty(userInput.password) || _.isEmpty(userInput.passwordconfirm)
      || _.isEmpty(userInput.email || _.isEmpty(userInput.fullname))
    ) {
      this.errorRegister = this.ERROR_ENTER_INFO;
    } else if (userInput.password.length < 8 || userInput.passwordconfirm.length < 8) {
      this.errorRegister = this.ERROR_PASSWORD_SHORT;
    } else if (!_.isEqual(userInput.password, userInput.passwordconfirm)) {
      this.errorRegister = this.ERROR_PASS_NOT_MATCH;
    } else {
      this.errorRegister = null;
      this.authService.CheckEmail(data).subscribe((response: any) => {
        if (response.msg === 0) {
          this.errorRegister = this.ERROR_USER_NAME_EXIST;
        } else if (response.msg === 2) {
          this.errorRegister = this.ERROR_WRONG_EMAIL;
        } else if (response.msg === 1) {
          this.onShowValidateCode = true;
          this.disabledInputRegister();
          this.validateCodeEmail = userInput.email;
          this.sendEmail(data);
        }
      }, (e) => {
        if (e.status === 0) {
          this.errorRegister = this.ERROR_SERVER;
        }
      });
    }
  }

  sendEmail(data) {
    this.authService.SendEmail(data).subscribe(() => {
      console.log('Sent');
      this.disabledInputRegister();
      this.onShowValidateCode = true;
      this.showTxtConfirmRegister = true;
      this.getCodeEmail(data);
      this.onShowConfirmRegister = true;
      this.onShowRegister = false;
      this.errorRegister = this.EMAIL_HAVE_SEND;
    }, (e) => {
      console.log('Not send');
      console.log(e);
    });
  }

  getCodeEmail(data) {
    this.authService.GetCodeEmail(data).subscribe((response: any) => {
      this.codeFromEmail = response;
    }, (e) => {
      console.log(e);
    });
  }


  confirm() {
    this.valueValidateCodeEmail = this.confirmForm.value.validatecode;
    const userInput = this.registerForm.value;
    const data = {
      username: userInput.username,
      password: userInput.password,
      email: userInput.email,
      fullname: userInput.fullname
    };
    if (_.isEqual(this.codeFromEmail.toString(), this.valueValidateCodeEmail.toString())) {
      console.log('ok');
      this.authService.CheckEmail(data).subscribe((response: any) => {
        console.log(response);
        this.userNameRegister = '';
        this.passWordRegister = '';
        this.confirmPassWordRegister = '';
        this.emailRegister = '';
        this.fullnameRegister = '';
        this.errorRegister = this.REGISTER_SUCCESS;
        this.inputValidateCode = true;
      }, (e) => {
        if (e.status === 0) {
          this.errorRegister = this.ERROR_SERVER;
        }
      });
    } else {
      this.errorRegister = this.VALIDATE_CODE_WRONG;
    }
  }

  showRegister() {
    this.onShowRegister = true;
    this.onShowLogin = false;
    this.onShowConfirmRegister = false;
    this.btnRegisterShow = false;
    this.btnLoginShow = true;
    this.userNameRegister = '';
    this.passWordRegister = '';
    this.confirmPassWordRegister = '';
    this.emailRegister = '';
    this.fullnameRegister = '';
    this.errorRegister = null;
    this.enableInputRegister();
  }

  showLogin() {
    this.userNameLogin = '';
    this.userPasswordLogin = '';
    this.errorLogin = null;
    this.onShowConfirmRegister = false;
    this.onShowRegister = false;
    this.onShowLogin = true;
    this.btnRegisterShow = true;
    this.btnLoginShow = false;
  }
}
