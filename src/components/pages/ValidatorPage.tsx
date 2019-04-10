import * as React from "react"
import { Form, Input, Button } from "antd"
import { fieldsOf } from "../../concept/fields";

interface State {
    userName?: {
        firstName?: string,
        lastName?: string
    }
    password?: string
}

export class ValidatorPage extends React.Component<{}, State> {

    constructor(props: {}) {
        super(props)
        this.state = {}
    }

    public render() {
        return (
            <Form layout="inline" style={{ margin: "16px 16px" }}>
                <Form.Item label="first name">
                    <Input {...fieldsOf(this).userName.firstName} />
                </Form.Item>
                <Form.Item label="last name">
                    <Input {...fieldsOf(this).userName.lastName} />
                </Form.Item>
                <Form.Item label="password">
                    <Input {...fieldsOf(this).password} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" onClick={() => { alert(JSON.stringify(this.state)) }}>Submit</Button>
                </Form.Item>
            </Form>
        );
    }
}