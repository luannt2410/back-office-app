import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'logout', component: LogoutComponent }
]

export const routing = RouterModule.forChild([
    {
        children: routes,
        path: '', component: LoginComponent,
    }
])