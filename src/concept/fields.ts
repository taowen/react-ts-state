import * as React from "react"

// provide field binding between state and input

export function fieldsOf<P, S>(comp: React.Component<P, S>): Fields<Required<S>> {
    return new Proxy(new FieldsProxy(comp as any), FieldsProxy.traps) as any
}

type Fields<S> = {
    [key in keyof S]: Field<Required<S>[key]>
}

class FieldsProxy {

    comp: React.Component

    constructor(comp: React.Component) {
        this.comp = comp
    }

    static traps: ProxyHandler<FieldsProxy> = {
        get(target: FieldsProxy, propertyKey: string) {
            return new Proxy(new FieldProxy(target.comp, [propertyKey]), FieldProxy.traps)
        }
    }
}

type Field<S> = {
    [key in keyof Required<S>]: Field<Required<S>[key]>
}

interface HTMLElementWithValue {
    value: string
}

class FieldProxy {

    comp: React.Component
    path: string[]

    constructor(comp: React.Component, path: string[]) {
        this.comp = comp
        this.path = path
    }

    get() {
        return getValue(this.comp.state, this.path)
    }

    set(value: any) {
        const newState = changeValueByCopy(this.comp.state, this.path, value)
        this.comp.setState(newState)
    }

    static traps: ProxyHandler<FieldProxy> = {
        get(target: FieldProxy, propertyKey: string) {
            if (propertyKey === 'value') {
                return target.get()
            }
            if (propertyKey === 'onChange') {
                return (e: React.ChangeEvent<HTMLElementWithValue>) => {
                    target.set(e.target.value)
                }
            }
            return new Proxy(new FieldProxy(target.comp, target.path.concat([propertyKey])), FieldProxy.traps)
        },
        getOwnPropertyDescriptor(target: FieldProxy, propertyKey: string) {
            if (propertyKey === 'value' || propertyKey === 'onChange') {
                return Reflect.getOwnPropertyDescriptor({ value: true, onChange: true }, propertyKey)
            }
            throw new Error('unsupported')
        },
        ownKeys(target: FieldProxy) {
            return ['value', 'onChange']
        }
    }
}

function getValue(state: any, path: string[]): any {
    if (path.length === 0) {
        return state
    }
    let [fistProp, ...remaining] = path
    if (state && state[fistProp]) {
        return getValue(state[fistProp], remaining)
    }
    return ''
}

export function changeValueByCopy(state: Record<string, any>|undefined, path: string[], value: any): Record<string, any> {
    if (path.length === 0) {
        throw new Error('must provide path')
    }
    if (path.length === 1) {
        return {
            ...state,
            [path[0]]: value
        }
    }
    let [firstProp, ...remaining] = path
    if (!state) {
        return {
            [firstProp]: changeValueByCopy(undefined, remaining, value)
        }
    }
    return {
        ...state,
        [firstProp]: changeValueByCopy(state[firstProp], remaining, value)
    }
}