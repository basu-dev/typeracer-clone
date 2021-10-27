import { ɵmarkDirty } from "@angular/core";

/**
 * 
 * When you decorate a property with  decorator, the change of the property will cause changeDetection.
 * It callse ɵmarkDirty  under the hood.
 * If you dont want to run change detection on change of sertain property then dont decorate it with  decorator.
 */
export function Property<T>() {
    let _val: T;
    return function (target: any, key: any) {
        Object.defineProperty(target, key, {
            set: function (value: T): T {
                _val = value;
                if ("__ngContext__" in this) {
                    ɵmarkDirty(this);
                }
                return _val;
            },
            get: function (): T {
                return _val;
            }
        });
    };
}
