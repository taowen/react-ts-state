import * as mobx from "mobx";
import * as form from "./form"
import "reflect-metadata"
import { FormItemProps } from "antd/lib/form";

const METADATA_KEY = 'validation:field'

export type ValidateStatus = FormItemProps['validateStatus']
export type FieldValidator = (val: any, fieldOptions: FieldOptions) => {
    validateStatus: ValidateStatus
    help?: string
} | undefined
export interface FieldValueChangedEvent {
    form: Record<string, any>
    field: string
    value: any
}
export type FieldValueChangedEventHandler = (e: FieldValueChangedEvent, fieldOptions: FieldOptions) => void

export interface FieldOptions {
    defaultValue?: any
    label?: string
    required?: boolean
    placeholder?: string
    help?: string
    validateOnChange?: boolean
    validateRequired?: FieldValidator
    validate?: FieldValidator
    onChange?: FieldValueChangedEventHandler
}

export function field(options: FieldOptions): (target: Record<string, any>, propertyKey: string) => void
export function field(target: Record<string, any>, propertyKey: string): void
export function field(target: any, propertyKey?: string) {
    let options = {}
    const decorator = (target: any, propertyKey: string) => {
        form.registerField(target.constructor, propertyKey)
        let meta = getMeta(target, propertyKey)
        if (!meta) {
            meta = {options: {}}
            setMeta(target, propertyKey, meta)
        }
        meta.options = options
        mobx.observable(target, propertyKey + '_validateStatus')
        mobx.observable(target, propertyKey + '_help')
        mobx.observable(target, propertyKey + '_placeholder')
        mobx.observable(target, propertyKey + '_label')
        return mobx.observable(target, propertyKey!)
    }
    if (!propertyKey) {
        options = target
        return decorator
    }
    return decorator(target, propertyKey)
}

interface FieldMeta {
    options: FieldOptions
}

export function getMeta(target: any, propertyKey: string): FieldMeta|undefined {
    return Reflect.getMetadata(METADATA_KEY, target, propertyKey) as FieldMeta
}

function setMeta(target: any, propertyKey: string, meta: FieldMeta) {
    Reflect.defineMetadata(METADATA_KEY, meta, target, propertyKey)
}

export function validateField(formObj: Record<string, any>, fieldName: string, options: FieldOptions) {
    if (options.required) {
        if (!validateRequired(formObj, fieldName, options)) {
            return false
        }
    }
    if (!options.validate) {
        return true
    }
    const result = options.validate(formObj[fieldName], options)
    if (result && isInvalid(result.validateStatus)) {
        formObj[fieldName + '_validateStatus'] = result.validateStatus
        if (result.help) {
            formObj[fieldName + '_help'] = result.help
        }
        return false
    }
    return true
}

function validateRequired(formObj: Record<string, any>, fieldName: string, options: FieldOptions): boolean {
    if (!options.validateRequired) {
        if (!formObj[fieldName]) {
            formObj[fieldName + '_validateStatus'] = 'error'
            formObj[fieldName + '_help'] = `${options.label} is required`
            return false
        }
        return true
    }
    const result = options.validateRequired(formObj[fieldName], options)
    if (result && isInvalid(result.validateStatus)) {
        formObj[fieldName + '_validateStatus'] = result.validateStatus
        if (result.help) {
            formObj[fieldName + '_help'] = result.help
        }
        return false
    }
    return true
}

function isInvalid(validateStatus: ValidateStatus) {
    return validateStatus && validateStatus !== 'success'
}

export function onChangeField(formObj: Record<string, any>, fieldName: string, options: FieldOptions) {
    if (options.validateOnChange) {
        form.form.resetValidateStatus(formObj, fieldName)
        if (!validateField(formObj, fieldName, options)) {
            return
        }
    }
    if (options.onChange) {
        options.onChange({
            form: formObj,
            field: fieldName,
            value: formObj[fieldName]
        }, options)
    }
}