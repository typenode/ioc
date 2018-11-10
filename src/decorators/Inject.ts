import {Container} from "../Container";

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
export function Inject(target: any, propertyName?: string, index?: number) {

    function annotate(getType: () => any, target: any, propertyName: string, index?: number) {
        let source: any = undefined;
        if (typeof index === 'number') {
            source = () => {
                const paramTypes: Array<any> = Reflect.getMetadata('design:paramtypes', target);
                return getType ? getType() : paramTypes[index];
            };
        } else {
            source = () => {
                let type = getType ? getType() : Reflect.getMetadata('design:type', target, propertyName);
                if (!type) {
                    // Needed to support react native inheritance
                    type = Reflect.getMetadata('design:type', target.constructor, propertyName);
                }
                return type;
            };
        }

        Container.defineHandler({
            target: target,
            propertyName: propertyName,
            index: index,
            value: () => {
                return Container.get(source());
            }
        });
    }

    if (arguments.length === 1) {
        return ((t: any, k?: string, d?: number) => {
            return annotate(target, t, k, d);
        }) as any;
    }
    return annotate(null, target, propertyName, index);

}