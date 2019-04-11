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
            @field
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
            @field
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

describe('resetValue', () => {
    it('should reset back to default value', () => {
        @form
        class MyForm {
            @field({ defaultValue: 'abc' })
            myField: string
        }
        let formObj = new MyForm()
        formObj.myField = 'def'
        form.resetValue(formObj, 'myField')
        expect(formObj.myField).eq('abc')
    })
    it('should reset all back to default valu if no propertyKey specified', () => {
        @form
        class MyForm {
            @field({ defaultValue: 'abc' })
            myField1: string
            @field({ defaultValue: 'abc' })
            myField2: string
        }
        let formObj = new MyForm()
        formObj.myField1 = 'def'
        formObj.myField2 = 'def'
        form.resetValue(formObj)
        expect(formObj.myField1).eq('abc')
        expect(formObj.myField2).eq('abc')
    })
    it('should reset nested form', () => {
        @form
        class MyForm {
            @field
            subForm = new SubForm()
        }
        class SubForm {
            @field({ defaultValue: 'abc' })
            myField1: string
            @field({ defaultValue: 'abc' })
            myField2: string
        }
        let formObj = new MyForm()
        formObj.subForm.myField1 = 'def'
        formObj.subForm.myField2 = 'def'
        form.resetValue(formObj)
        expect(formObj.subForm.myField1).eq('abc')
        expect(formObj.subForm.myField2).eq('abc')
    })
})

describe('validate field', () => {
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
            @field
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
    it('allow use customized validateRequired', () => {
        @form
        class MyForm {
            @field({ required: true, validateRequired: (val) => {
                return { validateStatus: 'warning' }
            }})
            myField1: string
        }
        let formObj = new MyForm()
        form.validate(formObj)
        expect(form.getValidateStatus(formObj, 'myField1')).eq('warning')
    })
    it('support other validate', () => {
        @form
        class MyForm {
            @field({
                required: true, validate: (val) => {
                    return { validateStatus: 'warning' }
                }
            })
            myField1: string
        }
        let formObj = new MyForm()
        form.validate(formObj)
        expect(form.getValidateStatus(formObj, 'myField1')).eq('warning')
    })
    it('runs validateRequired before validate', () => {
        @form
        class MyForm {
            @field({
                required: true, validateRequired: (val) => {
                    return { validateStatus: 'warning' }
                }, validate: (val) => {
                    return { validateStatus: 'error' }
                }
            })
            myField1: string
        }
        let formObj = new MyForm()
        form.validate(formObj)
        expect(form.getValidateStatus(formObj, 'myField1')).eq('warning')
    })
})

describe('validate form', () => {
    it('should return validateStatus and data', () => {
        @form
        class MyForm {
            @field
            subForm = new SubForm()
            @field({ required: true })
            myField2: string
        }
        class SubForm {
            @field({ required: true })
            myField1: string
        }
        let formObj = new MyForm()
        formObj.subForm.myField1 = 'hello'
        let [data, success] = form.validate(formObj)
        expect(success).false
        expect(data).deep.eq({subForm: {myField1: 'hello'}, myField2: undefined})
    })
    it('support multi field validate', () => {
        @form({validate: (formObj: MyForm) => {
            if (formObj.myField1 + formObj.myField2 > 5) {
                form.setValidateStatus(formObj, 'myField1', 'error')
            }
            return false
        }})
        class MyForm {
            @field
            myField1: number
            @field
            myField2: number
        }
        let formObj = new MyForm()
        formObj.myField1 = 3
        formObj.myField2 = 4
        let [data, success] = form.validate(formObj)
        expect(success).false
        expect(form.getValidateStatus(formObj, 'myField1')).eq('error')
    })
})