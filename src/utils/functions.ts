import 'reflect-metadata';
import {IoCContainer} from "../IoCContainer";
import {ConfigImpl}   from "../Config";
import {Class}        from "../types";

export function InjectPropertyDecorator(target: Function, key: string) {
    let t = Reflect.getMetadata('design:type', target, key);
    if (!t) {
        // Needed to support react native inheritance
        t = Reflect.getMetadata('design:type', target.constructor, key);
    }
    IoCContainer.injectProperty(target.constructor, key, t);
}

export function InjectParamDecorator<T>(target: Class<T>, propertyKey: string | symbol, parameterIndex: number) {
    if (!propertyKey) { // only intercept constructor parameters
        const config: ConfigImpl = IoCContainer.bind(target) as ConfigImpl;
        config.paramTypes = config.paramTypes || [];
        const paramTypes: Array<any> = Reflect.getMetadata('design:paramtypes', target);
        config.paramTypes.unshift(paramTypes[parameterIndex]);
    }
}

/**
 * Utility function to validate type
 */
export function checkType(source: Object) {
    if (!source) {
        throw new TypeError('Invalid type requested to IoC ' +
            'container. Type is not defined.');
    }
}