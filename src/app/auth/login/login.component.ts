import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService, HttpError } from '../shared';
import ValidationUtil from '../../util/validation';
import * as _ from 'lodash';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

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
      alert('Xin hãy nhập username');
    } else if (_.isEmpty(userInput.password) && !_.isEmpty(userInput.username)) {
      alert('Xin hãy nhập password');
    } else if (_.isEmpty(userInput.username) && _.isEmpty(userInput.password)) {
      alert('Xin hãy nhập username và password');
    } else {
      this.authService.Login(data).subscribe((v) => {
        if (v.user.username != null) {
          this.router.navigateByUrl('default');
        } else {
          this.router.navigateByUrl('');
        }
      }, (e) => {
        if (e.status === 0) {
          alert('Server bị lỗi');
        } else {
          alert('Bạn đã nhập sai mật khẩu');
        }
      });
    }
  }
}
