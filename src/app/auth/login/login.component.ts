import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService, HttpError } from '../shared';

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
    }
    console.log("data~~~", data);
    this.authService.Login(data).subscribe((v) => {
      console.log("Vvvvv~~", v);
      if (v.user.username != null) {
        this.router.navigateByUrl('default');
      }
      else {
        this.router.navigateByUrl('');
      }
    }, (e: HttpError) => {
      console.log("eeeee~~~", e);
      // this.message = e.Message();
    })

  }
}
