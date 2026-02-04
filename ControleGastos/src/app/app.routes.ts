import { Routes } from '@angular/router';
import { MainPage } from './pages/main-page/main-page';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { CadastrarGastosComponent } from './pages/cadastrar-gastos/cadastrar-gastos.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';

export const routes: Routes = [
    {
        path: '', component: MainPage
    },
        {
        path: 'login', component: LoginComponent
    },
    {
        path: 'signUp', component: SignUpComponent
    },
    {
        path: 'gastos', component: CadastrarGastosComponent
    },
        {
        path: 'dashboard', component: DashboardPageComponent
    }
];
