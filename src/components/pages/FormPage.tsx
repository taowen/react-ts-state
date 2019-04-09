import * as React from "react"
import { Form, Input, Button } from "antd"

interface State {
    userName?: string
}

function fieldsOf<P, S>(comp: React.Component<P, S>): Fields<Required<S>> {
    return new Proxy(new FieldsProxy(comp as any), FieldsProxy.traps) as any
}

type Fields<S> =  {
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
    [key in keyof S]: Field<Required<S>[key]>
}

class FieldProxy {

    comp: React.Component
    path: string[]

    constructor(comp: React.Component, path: string[]) {
        this.comp = comp
        this.path = path
    }

    static traps: ProxyHandler<FieldProxy> = {
        get(target: FieldProxy, propertyKey: string) {
            if (propertyKey === 'value') {
                return (target.comp.state as any)[target.path[0]]
            }
            if(propertyKey === 'onChange') {
                return (e: React.ChangeEvent) => {
                    target.comp.setState({[target.path[0]]: (e.target as any).value})
                }
            }
            return new Proxy(new FieldProxy(target.comp, [propertyKey]), FieldProxy.traps)
        },
        getOwnPropertyDescriptor(target: FieldProxy, propertyKey: string) {
            if (propertyKey === 'value' || propertyKey === 'onChange') {
                return Reflect.getOwnPropertyDescriptor({value: true, onChange: true}, propertyKey)
            }
            throw new Error('unsupported')
        },
        ownKeys(target: FieldProxy) {
            return ['value', 'onChange']
        }
    }
}

export class FormPage extends React.Component<{}, State> {

    constructor(props: {}) {
        super(props)
        this.state = { userName: "hello"}
    }

    public render() {
        return (
            <Form layout="inline" style={{ margin: "16px 16px" }}>
                <Form.Item label="user name">
                    <Input {...fieldsOf(this).userName} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>
        );
    }
}