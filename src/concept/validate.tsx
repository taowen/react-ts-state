import * as React from "react"
import { Form } from "antd";
import { FieldRefProxy } from "./fields";
import { AutoComponent } from "./auto";

interface Props {
    label: string
    field: any | FieldRefProxy
}

// export const withValidation = <P extends object>(
//     Component: React.ComponentType<P>
// ): React.FC<P & Props> => ({
//     label,
//     field,
//     ...props
// }: Props) => {
//         const fieldRef = (field as FieldRefProxy).__FIELD_REF
//         return (
//             <Form.Item label={label}>
//                 <Component {...props as P} value={field.value} onChange={field.onChange} />
//             </Form.Item>)
//     }


interface State {
    
}

export const withValidation = <P extends object>(Component: React.ComponentType<P>) =>
    class WithValidation extends AutoComponent<P & Props, State> {
        constructor(props: Props) {
            super((props.field as FieldRefProxy).__FIELD_REF.comp.props as any)
        }
        render() {
            const { label, field, ...props } = this.props;
            const fieldRef = (field as FieldRefProxy).__FIELD_REF
            return (
                <Form.Item label={label}>
                    <Component {...props as P} value={field.value} onChange={field.onChange} />
                </Form.Item>)
        }
    };