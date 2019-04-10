import * as ValidatorPage from "../components/pages/ValidatorPage";
import { field } from "../concept/validation/field";
import { form } from "../concept/validation/form";

@form
export class DemoForm implements ValidatorPage.State {

    @field
    userName = new SubForm()

    @field({required: true, placeholder: 'must be complex enough'})
    password: string

    onSubmit() {
        (this as any).password_validateStatus = 'error'
        console.log(this)
    }
}

class SubForm {

    @field({label: 'first name'})
    firstName: string

    @field({label: 'last name'})
    lastName: string
}