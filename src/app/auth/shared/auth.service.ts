import { Injectable } from "@angular/core";
import { IUser, HttpServiceGenerator } from './shared';
import { tap, map } from "rxjs/operators";

interface IAuthOption {
    // scope: string;
    // branch_code: string;
    username: string;
    password: string;
    // auto_login: boolean;
}

interface Result {
    username: string,
    password: string,
    email: string,
    fullname: string
}

interface ISession {
    id?: string;
}

interface ILoginReply {
    token: ISession;
    user: IUser;
}

@Injectable()
export class AuthService {

    constructor(
        private httpG: HttpServiceGenerator
    ) { }

    Login(option: IAuthOption) {
        console.log("IAuthOption~~~", option);
        // option.scope = option.scope || 'admin';
        return this.authApi.Post<ILoginReply>("login", {}, option)
            .pipe(tap(data => {
                console.log("data2222", data);
                localStorage.setItem('currentUser', JSON.stringify({ token: data.token }));
            }));
    }

    SendEmail(option: IAuthOption) {
        return this.authApi.Post('sendEmail', {}, option).pipe(tap(data => {
            console.log('sendEmail', data);
        }));
    }

    CheckEmail(res: Result) {
        return this.authApi.Post('checkemail', {}, res)
            .pipe(tap(data => {
                console.log('checkemail', data);
            }));
    }

    GetCodeEmail(option: IAuthOption) {
        return this.authApi.Post('getCodeEmail', {}, option)
            .pipe(tap(data => {
                console.log('getCodeEmail', data);
            }));
    }

    ValidateSession(scope?: string, token?: string) {
        console.log("current user~~~~", localStorage.getItem('currentUser'));
        return Object.keys(localStorage.getItem('currentUser')).length === 0;
    }


    private authApi = this.httpG.make("/auth");
}