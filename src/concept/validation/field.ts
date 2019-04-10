import * as mobx from "mobx";
import * as form from "./form"
import "reflect-metadata"

const METADATA_KEY = 'validation:field'

interface FieldOptions {
    label?: string
    required?: boolean
    placeholder?: string
    help?: string
}

export function field(options: FieldOptions): (target: Record<string, any>, propertyKey: string) => void
export function field(target: Record<string, any>, propertyKey: string): void
export function field(target: any, propertyKey?: string) {
    let options = {}
    const decorator = (target: any, propertyKey: string) => {
        form.registerField(target.constructor, propertyKey)
        getMeta(target, propertyKey).options = options
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
    options?: FieldOptions
}

export function getMeta(target: any, propertyKey: string): FieldMeta {
    let meta = Reflect.getMetadata(METADATA_KEY, target, propertyKey) as FieldMeta
    if (!meta) {
        meta = {}
        Reflect.defineMetadata(METADATA_KEY, meta, target, propertyKey)
    }
    return meta
}