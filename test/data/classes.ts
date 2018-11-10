import {Container, Inject} from '../../src';
import IBaseType           from './parent-type';
import {One}               from "./One";
import {Two}               from "./Two";

export class Worker {
    @Inject public type: IBaseType;

    public work() {
        this.type.method1();
    }
}


console.info(Container.get(One).two);
console.info(Container.get(Two).one);
