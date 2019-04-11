import { form } from "../src/concept/validation/form";
import { field } from "../src/concept/validation/field";
import * as chai from "chai"
const expect = chai.expect

describe('init options', () => {
    it('should set label and other optiosn properly', () => {
        @form
        class MyForm {
            @field({ label: 'hello', required: true, placeholder: 'awsome field', help: 'some help', defaultValue: 'abc' })
            myField: string
        }
        expect(form.getLabel(new MyForm(), 'myField')).eq('hello')
        expect(form.isRequired(new MyForm(), 'myField')).true
        expect(form.getPlaceholder(new MyForm(), 'myField')).eq('awsome field')
        expect(form.getHelp(new MyForm(), 'myField')).eq('some help')
        expect(new MyForm().myField).eq('abc')
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

describe('resetValidateStatus', () => {
    it('should reset single field', () => {
        @form
        class MyForm {
            @field({ required: true })
            myField: string
        }
        let formObj = new MyForm()
        form.validate(formObj)
        expect(form.getValidateStatus(formObj, 'myField')).eq('error')
        form.resetValidateStatus(formObj, 'myField')
        expect(form.getValidateStatus(formObj, 'myField')).undefined
    })
    it('should reset all fields if no propertyKey specified', () => {
        @form
        class MyForm {
            @field({ required: true })
            myField1: string
            @field({ required: true })
            myField2: string
        }
        let formObj = new MyForm()
        form.validate(formObj)
        form.resetValidateStatus(formObj)
        expect(form.getValidateStatus(formObj, 'myField1')).undefined
        expect(form.getValidateStatus(formObj, 'myField2')).undefined
    })
    it('should reset nested form', () => {
        @form
        class MyForm {
            subForm = new SubForm()
        }
        class SubForm {
            @field({ required: true })
            myField1: string
            @field({ required: true })
            myField2: string
        }
        let formObj = new MyForm()
        form.validate(formObj)
        form.resetValidateStatus(formObj)
        expect(form.getValidateStatus(formObj.subForm, 'myField1')).undefined
        expect(form.getValidateStatus(formObj.subForm, 'myField2')).undefined
    })
})

describe('validate', () => {
    it('should validate required field', () => {
        @form
        class MyForm {
            @field({required: true})
            myField: string
        }
        let formObj = new MyForm()
        form.validate(formObj)
        expect(form.getValidateStatus(formObj, 'myField')).eq('error')
    })
    it('should validate nested form', () => {
        @form
        class MyForm {
            subForm = new SubForm()
        }
        class SubForm {
            @field({ required: true })
            myField1: string
        }
        let formObj = new MyForm()
        form.validate(formObj)
        expect(form.getValidateStatus(formObj.subForm, 'myField1')).eq('error')
    })
})