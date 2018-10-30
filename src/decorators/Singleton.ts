import {Scope}        from "../Scope";
import {IoCContainer} from "../IoCContainer";

/**
 * A decorator to tell the container that this class should be handled by the Singleton [[Scope]].
 *
 * ```
 * @ Singleton
 * class PersonDAO {
 *
 * }
 * ```
 *
 * Is the same that use:
 *
 * ```
 * Container.bind(PersonDAO).scope(Scope.Singleton)
 * ```
 */
export function Singleton(target: Function) {
    IoCContainer.bind(target).scope(Scope.Singleton);
}