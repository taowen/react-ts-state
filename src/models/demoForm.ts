import * as ValidatorPage from "../components/pages/ValidatorPage";
import { field } from "../concept/validation/field";
import { form } from "../concept/validation/form";

@form
export class DemoForm implements ValidatorPage.State {

    @field
    userName = new SubForm()

    @field({required: true, placeholder: 'must be complex enough', help: 'blah'})
    password: string

    onSubmit() {
        form.validate(this)
    }
}

class SubForm {

    @field({label: 'first name'})
    firstName: string

    @field({label: 'last name'})
    lastName: string
}