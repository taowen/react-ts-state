import { Form, Input, Select, DatePicker, Checkbox } from "antd";
import { FormItemProps } from "antd/lib/form";
import * as mobx from "mobx";
import * as React from "react";
import { FieldRefProxy, HTMLElementWithValue } from "../FieldRef";

// make a input control to be bindable to @form
// the binding is done in two steps
// the @form bind to the form component via stateProviders
// the @field bind to the WithValidation<C> component via fieldsOf(this).xxx

interface Props {
    field: any | FieldRefProxy
    hasFeedback?: boolean
    colon?: boolean
    label?: string
    placeholder?: string
}

interface State {
    value?: any
    onChange?(e: React.ChangeEvent<HTMLElementWithValue>): void
    validateStatus?: FormItemProps['validateStatus']
    help?: string
    required?: boolean
    // can be set by both props and state
    label?: string
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
                const value = getValue(leaf, [leafProp])
                this.setState({
                    value: value,
                    validateStatus: getValue(leaf, [leafProp + '_validateStatus']),
                    help: getValue(leaf, [leafProp + '_help']),
                    required: getValue(leaf, [leafProp + '_required']),
                    placeholder: getValue(leaf, [leafProp + '_placeholder']),
                    label: getValue(leaf, [leafProp + '_label']),
                    onChange(e: React.ChangeEvent<HTMLElementWithValue>) {
                        const value = e.target ? e.target.value : e
                        setValue(form, fieldRef.path, value)
                        const onChange = getValue(leaf, [leafProp + '_onChange'])
                        onChange()
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
            let { label, placeholder, field, hasFeedback, colon, ...origProps } = this.props
            const state = this.state
            label = this.state.label || label
            placeholder = this.state.placeholder || placeholder
            return (
                <Form.Item label={label} hasFeedback={hasFeedback} colon={colon}
                    validateStatus={state.validateStatus} help={state.help} required={state.required}>
                    <Component {...origProps as P} value={state.value} onChange={state.onChange} placeholder={placeholder} />
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
export const VSelect = withValidation(Select)
export const VDatePicker = withValidation(DatePicker)
export const VCheckbox = withValidation(Checkbox)