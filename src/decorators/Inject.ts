import {InjectParamDecorator, InjectPropertyDecorator} from "../utils/functions";
/**
 * A decorator to request from Container that it resolve the annotated property dependency.
 * For example:
 *
 * ```
 * @ AutoWired
 * class PersonService {
 *    constructor (@ Inject creationTime: Date) {
 *       this.creationTime = creationTime;
 *    }
 *    @ Inject
 *    personDAO: PersonDAO;
 *
 *    creationTime: Date;
 * }
 *
 * ```
 *
 * When you call:
 *
 * ```
 * let personService: PersonService = Container.get(PersonService);
 * // The properties are all defined, retrieved from the IoC Container
 * console.log('PersonService.creationTime: ' + personService.creationTime);
 * console.log('PersonService.personDAO: ' + personService.personDAO);
 * ```
 */
export function Inject(...args: Array<any>) {
    if (args.length < 3 || typeof args[2] === 'undefined') {
        return InjectPropertyDecorator.apply(this, args);
    } else if (args.length === 3 && typeof args[2] === 'number') {
        return InjectParamDecorator.apply(this, args);
    }

    throw new Error('Invalid @Inject Decorator declaration.');
}