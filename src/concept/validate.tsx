import { Form } from "antd";
import { FormItemProps } from "antd/lib/form";
import * as React from "react";
import { FieldRef, FieldRefProxy, HTMLElementWithValue } from "./fields";
import * as mobx from "mobx"

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

        constructor(props: P) {
            super(props)
            this.state = {}
        }

        componentDidMount() {
            const { field } = this.props
            const fieldRef = (field as FieldRefProxy).__FIELD_REF
            console.log(fieldRef.comp.state)
            console.log(fieldRef.path)
            mobx.autorun(() => {

            })
        }

        render() {
            const { label, field, hasFeedback, ...origProps } = this.props
            return (
                <Form.Item label={label} validateStatus={this.state.validateStatus} hasFeedback={hasFeedback}>
                    <Component {...origProps as P} value={this.state.value} onChange={this.state.onChange} />
                </Form.Item>)
        }
    };