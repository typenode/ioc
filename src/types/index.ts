import {Scope} from "../Scope";

export type Class<T> = FunctionConstructor | Function | {
    new(...args: any[]): T;
};

/**
 * A factory for instances created by the Container. Called every time an instance is needed.
 */
export interface Provider {
    /**
     * Factory method, that should create the bind instance.
     * @return the instance to be used by the Container
     */
    get(): Object;
}

export interface Config {
    /**
     * Inform a given implementation type to be used when a dependency for the source type is requested.
     * @param target The implementation type
     */
    to(target: Object): Config;

    /**
     * Inform a provider to be used to create instances when a dependency for the source type is requested.
     * @param provider The provider to create instances
     */
    provider(provider: Provider): Config;

    /**
     * Inform a scope to handle the instances for objects created by the Container for this binding.
     * @param scope Scope to handle instances
     */
    scope(scope: Scope): Config;

    /**
     * Inform the types to be retrieved from IoC Container and passed to the type constructor.
     * @param paramTypes A list with parameter types.
     */
    withParams(...paramTypes: Array<any>): Config;
}

export interface Handler {

    /**
     * The implementation type.
     */
    target: any;

    /**
     * Class property name to set/replace value of.
     * Used if handler is applied on a class property.
     */
    propertyName?: string;

    /**
     * Parameter index to set/replace value of.
     * Used if handler is applied on a constructor parameter.
     */
    index?: number;

    /**
     * Factory function that produces value that will be set to class property or constructor parameter.
     * Accepts container instance which requested the value.
     */
    value: () => any;

}