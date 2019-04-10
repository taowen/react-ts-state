import * as mobx from "mobx";
import * as ValidatorPage from "../components/pages/ValidatorPage";

@form
export class DemoForm implements ValidatorPage.State {

    @field
    userName = new SubForm()

    @field
    password: string

    onSubmit() {
        (this as any).password_validateStatus = 'error'
        console.log(this)
    }
}

class SubForm {

    @field
    firstName: string

    @field
    lastName: string
}

function field(target: Object, propertyKey: string) {
    mobx.observable(target, propertyKey + '_validateStatus')
    mobx.observable(target, propertyKey + '_help')
    return mobx.observable(target, propertyKey)
}

function form<T extends { new(...args: any[]): {} }>(target: T) {
    return class extends target {
        constructor(...args: any[]) {
            super(...args)
            // so all methods can be accessed as properties
            const proto = Object.getPrototypeOf(Object.getPrototypeOf(this))
            for (const k of Object.getOwnPropertyNames(proto)) {
                if (typeof proto[k] === 'function') {
                    (this as any)[k] = proto[k].bind(this)
                }
            }
        }
    }
}