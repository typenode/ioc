import {One}    from "./One";
import {Inject} from "../../src";

export class Two {
    name = 'two';
    @Inject(() => One) one: One;
    constructor(@Inject(() => One) public oneFromConstructor: One) {
       
    }
}