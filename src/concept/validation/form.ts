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

function assignFieldOptions(target: Function, obj: any) {
    for (let fieldName of getMeta(target).fields) {
        let meta = field.getMeta(obj, fieldName)
        const options = Object.assign({ label: fieldName }, meta.options || {})
        for (let [k, v] of Object.entries(options)) {
            // for example: password_label
            (obj as any)[fieldName + '_' + k] = v
        }
        let fieldValue = obj[fieldName]
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