import {Inject} from "../../src";
import {Two}    from "./Two";

export class One {
    name = 'one';
    @Inject(() => Two) two: Two;
}