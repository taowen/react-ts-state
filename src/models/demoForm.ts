import * as mobx from "mobx";
import * as ValidatorPage from "../components/pages/ValidatorPage";

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

function field(target: any, propertyKey: string) {
    mobx.observable(target, propertyKey + '_validateStatus')
    mobx.observable(target, propertyKey + '_help')
    return mobx.observable(target, propertyKey)
}