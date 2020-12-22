import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HelloComponent} from './hello.component';
import {RouterModule} from '@angular/router';


@NgModule({
    declarations: [HelloComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([{
            path: '',
            component: HelloComponent
        }])
    ]
})
export class HelloModule {
}
