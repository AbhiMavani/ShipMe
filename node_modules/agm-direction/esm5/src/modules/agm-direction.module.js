import { NgModule } from '@angular/core';
import { AgmDirection } from '../directive/agm-direction.directive';
var AgmDirectionModule = /** @class */ (function () {
    function AgmDirectionModule() {
    }
    AgmDirectionModule.forRoot = function () {
        return {
            ngModule: AgmDirectionModule,
        };
    };
    AgmDirectionModule.forChild = function () {
        return {
            ngModule: AgmDirectionModule,
        };
    };
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
    return AgmDirectionModule;
}());
export { AgmDirectionModule };
//# sourceMappingURL=agm-direction.module.js.map