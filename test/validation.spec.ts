import { form } from "../src/concept/validation/form";
import { field } from "../src/concept/validation/field";
import * as chai from "chai"
const expect = chai.expect

describe('init options', () => {
    it('should set label and other optiosn properly', () => {
        @form
        class MyForm {
            @field({ label: 'hello', required: true, placeholder: 'awsome field', help: 'some help' })
            myField: string
        }
        expect(form.getLabel(new MyForm(), 'myField')).eq('hello')
        expect(form.isRequired(new MyForm(), 'myField')).true
        expect(form.getPlaceholder(new MyForm(), 'myField')).eq('awsome field')
        expect(form.getHelp(new MyForm(), 'myField')).eq('some help')
    })
    it('should set options even if inside nested object', () => {
        @form
        class MyForm {
            subForm = new SubForm()
        }

        class SubForm {
            @field({ label: 'hello', required: true, placeholder: 'awsome field', help: 'some help' })
            myField: string
        }
        expect(form.getLabel(new MyForm().subForm, 'myField')).eq('hello')
        expect(form.isRequired(new MyForm().subForm, 'myField')).true
        expect(form.getPlaceholder(new MyForm().subForm, 'myField')).eq('awsome field')
        expect(form.getHelp(new MyForm().subForm, 'myField')).eq('some help')
    })
})