import { Input } from "antd";
import * as React from "react"


interface FieldProps<T> {
    field: Field<T>
}

type Field<T> = {
    [key in keyof T]: Field<T[key]>
}

type Fields<T> = {
    [key in keyof T]: Field<T[key]>
}

export function fieldsOf<T>(state: T): Fields<T> {
    throw 'not implemented'
}

export const withValidator = <P extends object, T>(Component: React.ComponentType<P>) =>
    class WithValidator extends React.Component<P & FieldProps<T>> {
        render() {
            const { field, ...props } = this.props;
            return <Component {...props as P} />;
        }
    };
