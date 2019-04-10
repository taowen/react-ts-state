import * as React from "react"
import { Form, Input, Button } from "antd"
import { fieldsOf } from "../../concept/fields";
import { withValidation } from "../../concept/validate";
import { AutoComponent, AutoComponentProps } from "../../concept/auto";

const VInput = withValidation(Input)

interface Props extends AutoComponentProps<ValidatorPageState> {

}

export interface ValidatorPageState {
    userName: {
        firstName: string,
        lastName: string
    }
    password: string
}

export class ValidatorPage extends AutoComponent<Props, ValidatorPageState> {

    public render() {
        return (
            <Form layout="inline" style={{ margin: "16px 16px" }}>
                <VInput label="frist name" field={fieldsOf(this).userName.firstName} />
                <VInput label="last name" field={fieldsOf(this).userName.lastName} />
                <VInput label="password" field={fieldsOf(this).password} />
                <Form.Item>
                    <Button type="primary" htmlType="submit" onClick={() => { alert(JSON.stringify(this.state)) }}>Submit</Button>
                </Form.Item>
            </Form>
        );
    }
}