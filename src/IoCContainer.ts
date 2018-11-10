import {InjectorHanlder} from "./utils/InjectorHanlder";
import {ConfigImpl}      from "./Config";
import {Class, Config}   from "./types";
import {checkType}       from "./utils/functions";
import {SINGLETON}       from "./constants";

/**
 * Internal implementation of IoC Container.
 */
export class IoCContainer {

    public static isBound<T>(source: Class<T>): boolean {
        checkType(source);
        const baseSource = InjectorHanlder.getConstructorFromType(source);
        const config: ConfigImpl = IoCContainer.bindings.get(baseSource);
        return (!!config);
    }

    public static bind<T>(source: Class<T>): Config {
        checkType(source);
        const baseSource = InjectorHanlder.getConstructorFromType(source);
        let config: ConfigImpl = IoCContainer.bindings.get(baseSource);
        if (!config) {
            config = new ConfigImpl(baseSource);
            IoCContainer.bindings.set(baseSource, config);
        }
        return config;
    }

    public static get<T>(source: Class<T>): T {
        const config: ConfigImpl = IoCContainer.bind(source) as ConfigImpl;
        if (!config.iocprovider) {
            config.to(config.source as FunctionConstructor);
        }
        return config.getInstance();
    }

    public static getType<T>(source: Class<T>): Function {
        checkType(source);
        const baseSource = InjectorHanlder.getConstructorFromType(source);
        const config: ConfigImpl = IoCContainer.bindings.get(baseSource);
        if (!config) {
            throw new TypeError(`The type ${source.name} hasn't been registered with the IOC Container`);
        }
        return config.targetSource || config.source;
    }

    public static injectProperty<T>(target: Function, key: string, propertyType: Class<T>) {
        const propKey = `__${key}`;
        Object.defineProperty(target.prototype, key, {
            enumerable: true,
            get: function () {
                return this[propKey] ? this[propKey] : this[propKey] = IoCContainer.get(propertyType);
            },
            set: function (newValue) {
                this[propKey] = newValue;
            }
        });
    }

    public static assertInstantiable(target: any) {
        if (target[SINGLETON]) {
            throw new TypeError('Can not instantiate Singleton class. ' +
                'Ask Container for it, using Container.get');
        }
    }

    private static bindings: Map<FunctionConstructor, ConfigImpl> = new Map<FunctionConstructor, ConfigImpl>();
}