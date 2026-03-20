import { Routes } from '@angular/router';
import { MainPage } from './pages/main-page/main-page';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { CadastrarGastosComponent } from './pages/cadastrar-gastos/cadastrar-gastos.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { PerfilPageComponent } from './pages/perfil-page/perfil-page.component';
import { CategoriasPageComponent } from './pages/categorias-page/categorias-page.component';
import { UsuariosPageComponent } from './pages/usuarios-page/usuarios-page.component';
import { adminGuard, authenticationGuard } from './services/authentication.guard';

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
        path: 'gastos', component: CadastrarGastosComponent, canActivate: [authenticationGuard]
    },
    {
        path: 'dashboard', component: DashboardPageComponent, canActivate: [authenticationGuard]
    },
    {
        path: 'perfil', component: PerfilPageComponent, canActivate: [authenticationGuard]
    },
    {
        path: 'categorias', component: CategoriasPageComponent, canActivate: [authenticationGuard]
    },
    {
        path: 'usuarios', component: UsuariosPageComponent, canActivate: [adminGuard]
    }
];
