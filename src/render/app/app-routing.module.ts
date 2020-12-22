import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
    },
    {
        path: 'hello',
        loadChildren: () => import('./hello/hello.module').then(m => m.HelloModule)
    }];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
