import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [
  // { path: "admin", loadChildren: "./auth/index" },
  // { path: "auth", loadChildren: "./auth/index#AuthModule" },
  // { path: "", pathMatch: "full", redirectTo: "auth" },
  { path: 'auth', loadChildren: "./auth/index#AuthModule" },
  { path: "", pathMatch: "full", redirectTo: "auth" },

  {
    path: 'default',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
    ]
  },
];

export const appRouting = RouterModule.forRoot(routes, { useHash: true });


@NgModule({
  imports: [appRouting],
  exports: [RouterModule]
})
export class AppRoutingModule { }
