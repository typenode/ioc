/**
 * The IoC Container class. Can be used to register and to retrieve your dependencies.
 * You can also use de decorators [[AutoWired]], [[Scoped]], [[Singleton]], [[Provided]] and [[Provides]]
 * to configure the dependency directly on the class.
 */
import {IoCContainer}                     from "./IoCContainer";
import {AutoWired}                        from "./decorators/AutoWired";
import {Class, Config, Handler, Provider} from "./types";
import {ConfigImpl}                       from "./Config";
import {Scope}                            from "./Scope";
import {KEY}                              from "./constants";

export class Container {

    private static snapshots: { providers: Map<Function, Provider>; scopes: Map<Function, Scope> } = {
        providers: new Map(),
        scopes: new Map(),
    };

    /**
     * Add a dependency to the Container. If this type is already present, just return its associated
     * configuration object.
     * Example of usage:
     *
     * ```
     * Container.bind(PersonDAO).to(ProgrammerDAO).scope(Scope.Singleton);
     * ```
     * @param source The type that will be bound to the Container
     * @return a container configuration
     */
    public static bind<T>(source: Class<T>): Config {
        if (!IoCContainer.isBound(source)) {
            AutoWired(source);
            return IoCContainer.bind(source).to(source);
        }

        return IoCContainer.bind(source);
    }

    /**
     * Retrieve an object from the container. It will resolve all dependencies and apply any type replacement
     * before return the object.
     * If there is no declared dependency to the given source type, an implicity bind is performed to this type.
     * @param source The dependency type to resolve
     * @return an object resolved for the given source type;
     */
    public static get<T>(source: Class<T>): T {
        return IoCContainer.get(source);
    }

    /**
     * Retrieve a type associated with the type provided from the container
     * @param source The dependency type to resolve
     * @return an object resolved for the given source type;
     */
    public static getType<T>(source: Class<T>) {
        return IoCContainer.getType(source);
    }

    /**
     * Store the state for a specified binding.  Can then be restored later.   Useful for testing.
     * @param source The dependency type
     */
    public static snapshot<T>(source: Class<T>): void {
        const config = Container.bind(source) as ConfigImpl;
        Container.snapshots.providers.set(source, config.iocprovider);
        if (config.iocscope) {
            Container.snapshots.scopes.set(source, config.iocscope);
        }
        return;
    }

    /**
     * Restores the state for a specified binding that was previously captured by snapshot.
     * @param source The dependency type
     */
    public static restore<T>(source: Class<T>): void {
        if (!(Container.snapshots.providers.has(source))) {
            throw new TypeError('Config for source was never snapshoted.');
        }
        const config = Container.bind(source);
        config.provider(Container.snapshots.providers.get(source));
        if (Container.snapshots.scopes.has(source)) {
            config.scope(Container.snapshots.scopes.get(source));
        }
    }

    public static defineHandler(handler: Handler) {
        if (typeof handler.index === 'number' && !handler.propertyName) {
            const config: ConfigImpl = IoCContainer.bind(handler.target) as ConfigImpl;
            config.parameters = config.parameters || [];
            config.parameters.unshift(handler.value);
        } else {
            Object.defineProperty(handler.target, handler.propertyName, {
                enumerable: true,
                get: function () {
                    if (Reflect.hasMetadata(KEY, this, handler.propertyName)) {
                        return Reflect.getMetadata(KEY, this, handler.propertyName);
                    }
                    const value = handler.value();
                    Reflect.defineMetadata(KEY, value, this, handler.propertyName);
                    return value;
                },
                set: function (newValue) {
                    Reflect.defineMetadata(KEY, newValue, this, handler.propertyName);
                }
            });
        }
    }
}