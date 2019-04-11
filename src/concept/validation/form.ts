import * as field from "./field";

const METADATA_KEY = 'validation:form'

export function form<T extends { new(...args: any[]): {} }>(target: T) {
    let meta = getMeta(target)
    if (!meta) {
        meta = { fields: [] }
        setMeta(target, meta)
    }
    const wrapper = class extends target {

        constructor(...args: any[]) {
            super(...args);
            // wrapper makes Reflet.getMetadata hard to get actual constructor
            // set the metadata to instance to make things easier
            (this as any).__META = meta
            // so all methods can be accessed as properties
            assignProtoMethods(this)
            assignFieldOptions(this)
        }
    }
    return wrapper
}

form.validate = (formObj: Record<string, any>, path?: string[]): void => {
    if (!path) {
        form.resetValidateStatus(formObj)
    }
    const meta = getMetaFromObject(formObj)
    if (!meta) {
        throw new Error('requires object marked with @form')
    }
    for (let fieldName of meta.fields) {
        let meta = field.getMeta(formObj, fieldName)!
        const options = meta.options
        field.validateField(formObj, fieldName, options)
        const fieldValue = formObj[fieldName]
        if (getMetaFromObject(fieldValue)) {
            form.validate(fieldValue, path ? path.concat([fieldName]) : [fieldName])
        }
    }
}

form.getLabel = <F extends Record<string, any>>(formObj: F, fieldName: keyof F): string => {
    return formObj[fieldName + '_label']
}

form.getPlaceholder = <F extends Record<string, any>>(formObj: F, fieldName: keyof F): string => {
    return formObj[fieldName + '_placeholder']
}

form.getHelp = <F extends Record<string, any>>(formObj: F, fieldName: keyof F): string => {
    return formObj[fieldName + '_help']
}

form.isRequired = <F extends Record<string, any>>(formObj: F, fieldName: keyof F): boolean => {
    return formObj[fieldName + '_required']
}

form.getValidateStatus = <F extends Record<string, any>>(formObj: F, fieldName: keyof F): field.ValidateStatus => {
    return formObj[fieldName + '_validateStatus']
}

form.resetValidateStatus = <F extends Record<string, any>>(formObj: F, propertyKey?: keyof F) => {
    if (propertyKey) {
        let meta = field.getMeta(formObj, propertyKey as any)!
        formObj[propertyKey + '_validateStatus'] = undefined
        formObj[propertyKey + '_help'] = meta.options.help
        const fieldValue = formObj[propertyKey]
        // is nested form?
        if (getMetaFromObject(fieldValue)) {
            form.resetValidateStatus(fieldValue)
        }
        return
    }
    const meta = getMetaFromObject(formObj)
    if (!meta) {
        throw new Error('requires object marked with @form')
    }
    for (let f of meta.fields) {
        form.resetValidateStatus(formObj, f)
    }
}

form.resetValue = <F extends Record<string, any>>(formObj: F, propertyKey?: keyof F) => {
    if (propertyKey) {
        const meta = field.getMeta(formObj, propertyKey as any)
        formObj[propertyKey] = meta ? meta.options.defaultValue : undefined
        const fieldValue = formObj[propertyKey]
        // is nested form?
        if (getMetaFromObject(fieldValue)) {
            form.resetValue(fieldValue)
        }
        return
    }
    const meta = getMetaFromObject(formObj)
    if (!meta) {
        throw new Error('requires object marked with @form')
    }
    for (let field of meta.fields) {
        form.resetValue(formObj, field)
    }
}


function assignProtoMethods(obj: any) {
    const proto = Object.getPrototypeOf(Object.getPrototypeOf(obj))
    for (const k of Object.getOwnPropertyNames(proto)) {
        if (typeof proto[k] === 'function') {
            (obj as any)[k] = proto[k].bind(obj)
        }
    }
}

function assignFieldOptions(obj: Record<string, any>) {
    const meta = getMetaFromObject(obj)!
    // @field might not be initialized with value, so we can not iterate props to find all fields
    for (let fieldName of meta.fields) { 
        let meta = field.getMeta(obj, fieldName)!
        if (!meta.options.label) {
            meta.options.label = fieldName
        }
        obj[fieldName + '_onChange'] = field.onChangeField.bind(null, obj, fieldName, meta.options)
        for (let [k, v] of Object.entries(meta.options)) {
            // for example: password_label
            if (k === 'defaultValue') {
                obj[fieldName] = v
            } else {
                obj[fieldName + '_' + k] = v
            }
        }
    }
    // nested form might not be marked as @field, we iterate all props instead
    // nested form must be initialized
    for (let fieldValue of Object.values(obj)) {
        if (fieldValue && getMetaFromObject(fieldValue)) {
            assignFieldOptions(fieldValue)
        }
    }
}

interface FormMeta {
    fields: string[]
}

export function registerField(target: Function, field: string) {
    let meta = getMeta(target)
    if (!meta) {
        meta = { fields: [] }
        setMeta(target, meta)
    }
    meta.fields.push(field)
}

export function getMetaFromObject(target: Record<string, any>): FormMeta | undefined {
    if (!target) {
        return undefined
    }
    if (target.__META) {
        return target.__META
    }
    return getMeta(target.constructor)
}

export function getMeta(target: Function): FormMeta | undefined {
    return Reflect.getMetadata(METADATA_KEY, target) as FormMeta
}

function setMeta(target: Function, meta: FormMeta) {
    Reflect.defineMetadata(METADATA_KEY, meta, target)
}