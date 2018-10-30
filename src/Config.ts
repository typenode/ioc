import {Config, Provider} from "./types";
import {InjectorHanlder}  from "./utils/InjectorHanlder";
import {Scope}            from "./Scope";
import {IoCContainer}     from "./IoCContainer";
import {checkType}        from "./utils/functions";

/**
 * A bind configuration for a given type in the IoC Container.
 */


export class ConfigImpl implements Config {
    public source: Function;
    public targetSource: Function;
    public iocprovider: Provider;
    public iocscope: Scope;
    public decoratedConstructor: FunctionConstructor;
    public paramTypes: Array<any>;

    constructor(source: Function) {
        this.source = source;
    }

    public to(target: FunctionConstructor) {
        checkType(target);
        const targetSource = InjectorHanlder.getConstructorFromType(target);
        this.targetSource = targetSource;
        if (this.source === targetSource) {
            const configImpl = this;
            this.iocprovider = {
                get: () => {
                    const params:any = configImpl.getParameters();
                    if (configImpl.decoratedConstructor) {
                        return (params ? new configImpl.decoratedConstructor(...params) : new configImpl.decoratedConstructor());
                    }
                    return (params ? new target(...params) : new target());
                }
            };
        } else {
            this.iocprovider = {
                get: () => {
                    return IoCContainer.get(target);
                }
            };
        }
        if (this.iocscope) {
            this.iocscope.reset(this.source);
        }
        return this;
    }

    public provider(provider: Provider) {
        this.iocprovider = provider;
        if (this.iocscope) {
            this.iocscope.reset(this.source);
        }
        return this;
    }

    public scope(scope: Scope) {
        this.iocscope = scope;
        if (scope === Scope.Singleton) {
            (this as any).source['__block_Instantiation'] = true;
            scope.reset(this.source);
        } else if ((this as any).source['__block_Instantiation']) {
            delete (this as any).source['__block_Instantiation'];
        }
        return this;
    }

    public withParams(...paramTypes: Array<any>) {
        this.paramTypes = paramTypes;
        return this;
    }

    public toConstructor(newConstructor: FunctionConstructor) {
        this.decoratedConstructor = newConstructor;
        return this;
    }

    public getInstance() {
        if (!this.iocscope) {
            this.scope(Scope.Local);
        }
        return this.iocscope.resolve(this.iocprovider, this.source);
    }

    private getParameters() {
        if (this.paramTypes) {
            return this.paramTypes.map(paramType => IoCContainer.get(paramType));
        }
        return null;
    }
}