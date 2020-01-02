import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { routing } from './auth.routes';
import { LoginComponent } from './login/login.component';
import { AuthProvider } from './auth-provider';
import { AuthComponent } from './auth/auth.component';
import { LogoutComponent } from './logout/logout.component';
@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        routing
    ],
    declarations: [LoginComponent, AuthComponent, LogoutComponent],
    providers: [AuthProvider]
})

export class AuthModule {

}