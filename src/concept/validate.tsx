import { Form, Input } from "antd";
import { FormItemProps } from "antd/lib/form";
import * as mobx from "mobx";
import * as React from "react";
import { FieldRefProxy, HTMLElementWithValue } from "./fields";

interface Props {
    label: string
    field: any | FieldRefProxy
    hasFeedback?: boolean
}

interface State {
    value?: any
    onChange?(e: React.ChangeEvent<HTMLElementWithValue>): void
    validateStatus?: FormItemProps['validateStatus']
    help?: string
    required?: boolean
    placeholder?: string
}

export const withValidation = <P extends Record<string, any>>(Component: React.ComponentType<P>) =>
    class WithValidation extends React.Component<P & Props, State> {

        private disposeAutoRun: mobx.IReactionDisposer | null = null;

        constructor(props: P) {
            super(props)
            this.state = {}
        }

        componentDidMount() {
            const { field } = this.props
            const fieldRef = (field as FieldRefProxy).__FIELD_REF
            const { getState } = fieldRef.comp.props as any
            const form = getState(fieldRef.comp.constructor)
            const leafPath = fieldRef.path.slice(0, fieldRef.path.length - 1)
            const leafProp = fieldRef.path[fieldRef.path.length - 1]
            this.disposeAutoRun = mobx.autorun(() => {
                const leaf = getValue(form, leafPath)
                this.setState({
                    value: getValue(leaf, [leafProp]),
                    validateStatus: getValue(leaf, [leafProp + '_validateStatus']),
                    help: getValue(leaf, [leafProp + '_help']),
                    required: getValue(leaf, [leafProp + '_required']),
                    placeholder: getValue(leaf, [leafProp + '_placeholder']),
                    onChange(e: React.ChangeEvent<HTMLElementWithValue>) {
                        setValue(form, fieldRef.path, e.target.value)
                    }
                })
            })
        }

        componentWillUnmount() {
            if (this.disposeAutoRun) {
                this.disposeAutoRun()
            }
        }

        render() {
            const { label, field, hasFeedback, ...origProps } = this.props
            const state = this.state
            return (
                <Form.Item label={label} validateStatus={state.validateStatus} help={state.help} required={state.required} hasFeedback={hasFeedback}>
                    <Component {...origProps as P} value={state.value} onChange={state.onChange} placeholder={state.placeholder} />
                </Form.Item>)
        }
    };

function getValue(state: any, path: string[]): any {
    if (path.length === 0) {
        return state
    }
    let [fistProp, ...remaining] = path
    return getValue(state[fistProp], remaining)
}

function setValue(state: Record<string, any>, path: string[], value: any) {
    if (path.length === 0) {
        throw new Error('must provide path')
    }
    if (path.length === 1) {
        state[path[0]] = value
        return
    }
    let [firstProp, ...remaining] = path
    setValue(state[firstProp], remaining, value)
}

export const VInput = withValidation(Input)