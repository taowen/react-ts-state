import * as mobx from "mobx";
import * as ValidatorPage from "../components/pages/ValidatorPage";
import { FormModel } from "../concept/validate";

export class DemoForm implements ValidatorPage.State {
    @field
    userName = new SubForm()
    @field
    password: string
}

class SubForm {
    @field
    firstName: string
    @field
    lastName: string
}

function field(target: any, propertyKey: string) {
    return mobx.observable(target, propertyKey)
}