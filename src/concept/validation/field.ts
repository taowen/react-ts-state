import * as mobx from "mobx";

interface FieldOptions {
    required?: boolean
    placeholder?: string
}

export function field(options: FieldOptions): void
export function field(target: Record<string, any>, propertyKey: string): void
export function field(target: any, propertyKey?: string) {
    mobx.observable(target, propertyKey + '_validateStatus')
    mobx.observable(target, propertyKey + '_help')
    mobx.observable(target, propertyKey + '_placeholder')
    mobx.observable(target, propertyKey + '_label')
    return mobx.observable(target, propertyKey!)
}