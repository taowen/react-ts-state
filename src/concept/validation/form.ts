import * as field from "./field";

const METADATA_KEY = 'validation:form'

interface FormOptions {
    validate?: (formObj: any) => boolean|void
}

export function form(options: FormOptions): <T extends { new(...args: any[]): {} }>(target: T) => T;
export function form<T extends { new(...args: any[]): {} }>(target: T, options?: FormOptions): T;
export function form<T extends { new(...args: any[]): {} }>(target: T, options?: FormOptions) {
    if (typeof target !== 'function') {
        return (f: any) =>  {
            form(f, target)
        }
    }
    if (!options) {
        options = {}
    }
    let meta = getMeta(target)
    if (!meta) {
        meta = { fields: [], options: options }
        setMeta(target, meta)
    } else {
        meta.options = options
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

form.validate = (formObj: Record<string, any>, path?: string[]): [Record<string, any>, boolean] => {
    if (!path) {
        form.resetValidateStatus(formObj)
    }
    const meta = getMetaFromObject(formObj)
    if (!meta) {
        throw new Error('requires object marked with @form')
    }
    let success = true
    if (meta.options.validate) {
        if (!meta.options.validate(formObj)) {
            success = false
        }
    }
    const data: Record<string, any> = {}
    for (let fieldName of meta.fields) {
        let meta = field.getMeta(formObj, fieldName)!
        const options = meta.options
        if (!field.validateField(formObj, fieldName, options)) {
            success = false
        }
        const fieldValue = formObj[fieldName]
        if (getMetaFromObject(fieldValue)) {
            let [subData, subSucccess] = form.validate(fieldValue, path ? path.concat([fieldName]) : [fieldName])
            if (!subSucccess) {
                success = false
            }
            data[fieldName] = subData
        } else {
            data[fieldName] = fieldValue
        }
    }
    return [data, success]
}

form.getLabel = <F extends Record<string, any>>(formObj: F, fieldName: keyof F): string => {
    return formObj[fieldName + '_label']
}

form.setLabel = <F extends Record<string, any>>(formObj: F, fieldName: keyof F, label: string): void => {
    formObj[fieldName + '_label'] = label
}

form.getPlaceholder = <F extends Record<string, any>>(formObj: F, fieldName: keyof F): string => {
    return formObj[fieldName + '_placeholder']
}

form.setPlaceholder = <F extends Record<string, any>>(formObj: F, fieldName: keyof F, placeholder: string): void => {
    formObj[fieldName + '_placeholder'] = placeholder
}

form.getHelp = <F extends Record<string, any>>(formObj: F, fieldName: keyof F): string => {
    return formObj[fieldName + '_help']
}

form.setHelp = <F extends Record<string, any>>(formObj: F, fieldName: keyof F, help: string): void => {
    formObj[fieldName + '_help'] = help
}

form.isRequired = <F extends Record<string, any>>(formObj: F, fieldName: keyof F): boolean => {
    return formObj[fieldName + '_required']
}

form.setRequired = <F extends Record<string, any>>(formObj: F, fieldName: keyof F, required: boolean): void => {
    const options = field.getMeta(formObj, fieldName as any)!.options
    options.required = required
    formObj[fieldName + '_required'] = required
    formObj[fieldName + '_validateStatus'] = undefined
    formObj[fieldName + '_help'] = options.help
}

form.getValidateStatus = <F extends Record<string, any>>(formObj: F, fieldName: keyof F): field.ValidateStatus => {
    return formObj[fieldName + '_validateStatus']
}

form.setValidateStatus = <F extends Record<string, any>>(formObj: F, fieldName: keyof F, validateStatus: field.ValidateStatus): void => {
    formObj[fieldName + '_validateStatus'] = validateStatus
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
        const fieldType = Reflect.getMetadata('design:type', obj, fieldName)
        if (meta.options.label === undefined && fieldType != Boolean) {
            meta.options.label = fieldName
        }
        obj[fieldName + '_onChange'] = field.onChangeField.bind(null, obj, fieldName, meta.options)
        for (let [k, v] of Object.entries(meta.options)) {
            // for example: password_label
            if (k === 'defaultValue') {
                obj[fieldName] = v
            } else if (k === 'onChange') {
                // onChange is handled first by field.onChangeField
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
    options: FormOptions
}

export function registerField(target: Function, field: string) {
    let meta = getMeta(target)
    if (!meta) {
        meta = { fields: [], options: {} }
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