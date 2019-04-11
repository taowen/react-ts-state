import * as field from "./field"

const METADATA_KEY = 'validation:form'

export function form<T extends { new(...args: any[]): {} }>(target: T) {
    return class extends target {

        constructor(...args: any[]) {
            super(...args)
            // so all methods can be accessed as properties
            assignProtoMethods(this)
            assignFieldOptions(target, this)
        }

        validate(): void {
            for (let fieldName of getMeta(target).fields) {
                let meta = field.getMeta(this, fieldName)
                const options = meta.options
                let obj = this as Record<string, any>
                if (options.required && !obj[fieldName]) {
                    obj[fieldName + '_validateStatus'] = 'error'
                    obj[fieldName + '_help'] = options.help || `${options.label} is required`
                }
            }
        }
    }
}

form.validate = (formObj: Record<string, any>): void => {
    if (formObj.validate) {
        formObj.validate()
    }
}

form.getLabel = <F extends Record<string, any>>(formObj: F, fieldName: keyof F) => {
    return formObj[fieldName + '_label']
}

form.getPlaceholder = <F extends Record<string, any>>(formObj: F, fieldName: keyof F) => {
    return formObj[fieldName + '_placeholder']
}

form.getHelp = <F extends Record<string, any>>(formObj: F, fieldName: keyof F) => {
    return formObj[fieldName + '_help']
}

form.isRequired = <F extends Record<string, any>>(formObj: F, fieldName: keyof F): boolean => {
    return formObj[fieldName + '_required']
}


function assignProtoMethods(obj: any) {
    const proto = Object.getPrototypeOf(Object.getPrototypeOf(obj))
    for (const k of Object.getOwnPropertyNames(proto)) {
        if (typeof proto[k] === 'function') {
            (obj as any)[k] = proto[k].bind(obj)
        }
    }
}

function assignFieldOptions(target: Function, obj: any) {
    // @field might not be initialized with value, so we can not iterate props to find all fields
    for (let fieldName of getMeta(target).fields) {
        let meta = field.getMeta(obj, fieldName)
        if (!meta.options.label) {
            meta.options.label = fieldName
        }
        for (let [k, v] of Object.entries(meta.options)) {
            // for example: password_label
            (obj as any)[fieldName + '_' + k] = v
        }
    }
    // nested form might not be marked as @field, we iterate all props instead
    // nested form must be initialized
    for (let fieldValue of Object.values(obj)) {
        if (fieldValue && getMeta(fieldValue.constructor).fields.length > 0) {
            assignFieldOptions(fieldValue.constructor, fieldValue)
        }
    }
}

interface FormMeta {
    fields: string[]
}

export function registerField(target: Function, field: string) {
    getMeta(target).fields.push(field)
}

export function getMeta(target: Function): FormMeta {
    let meta = Reflect.getMetadata(METADATA_KEY, target) as FormMeta
    if (!meta) {
        meta = { fields: [] }
        Reflect.defineMetadata(METADATA_KEY, meta, target)
    }
    return meta
}