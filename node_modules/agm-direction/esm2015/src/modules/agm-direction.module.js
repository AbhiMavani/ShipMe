import { NgModule } from '@angular/core';
import { AgmDirection } from '../directive/agm-direction.directive';
export class AgmDirectionModule {
    static forRoot() {
        return {
            ngModule: AgmDirectionModule,
        };
    }
    static forChild() {
        return {
            ngModule: AgmDirectionModule,
        };
    }
}
AgmDirectionModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    AgmDirection,
                ],
                exports: [
                    AgmDirection,
                ]
            },] }
];
//# sourceMappingURL=agm-direction.module.js.map