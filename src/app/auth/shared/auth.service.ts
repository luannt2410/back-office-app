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
    session: ISession;
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
                localStorage.setItem('currentUser', JSON.stringify({ token: data.session }));
            }));
    }

    private authApi = this.httpG.make("/auth");
}