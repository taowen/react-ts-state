import * as React from "react"
import { Form, Input, Button } from "antd"
import { fieldsOf } from "../../concept/fields";
import { withValidation } from "../../concept/validate";
import { AutoComponent } from "../../concept/auto";

interface State {
    userName?: {
        firstName?: string,
        lastName?: string
    }
    password?: string
}

const VInput = withValidation(Input)

export class ValidatorPage extends AutoComponent<{}, State> {

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