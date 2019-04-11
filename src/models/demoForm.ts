import * as ValidatorPage from "../components/pages/ValidatorPage";
import { field, FieldValidator, ValidateStatus } from "../concept/validation/field";
import { form } from "../concept/validation/form";
import { byRegex } from "../concept/validation/validator";

@form
export class DemoForm implements ValidatorPage.State {

    @field
    userName = new SubForm()

    @field({ required: true, placeholder: 'must be complex enough', help: 'blah' })
    password: string

    onSubmit() {
        form.validate(this)
    }
}

class SubForm {

    @field({ label: 'first name', validate: byRegex(/^[a-zA-Z0-9]+$/) })
    firstName: string

    @field({ label: 'last name', validate: byRegex(/^[a-zA-Z0-9]+$/)  })
    lastName: string
}