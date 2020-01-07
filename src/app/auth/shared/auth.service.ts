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

    Register(option: IAuthOption) {
        return this.authApi.Post('register', {}, option)
            .pipe(tap(data => {
                console.log('register', data);
            }));
    }

    ValidateSession(scope?: string, token?: string) {
        console.log("current user~~~~", localStorage.getItem('currentUser'));
        return Object.keys(localStorage.getItem('currentUser')).length === 0;
    }

    private authApi = this.httpG.make("/auth");
}