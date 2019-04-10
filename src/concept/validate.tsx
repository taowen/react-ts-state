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
            this.disposeAutoRun = mobx.autorun(() => {
                this.setState({
                    value: getValue(form, fieldRef.path),
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
            return (
                <Form.Item label={label} validateStatus={this.state.validateStatus} hasFeedback={hasFeedback}>
                    <Component {...origProps as P} value={this.state.value} onChange={this.state.onChange} />
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