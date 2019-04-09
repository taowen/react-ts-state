import * as React from "react"
import { Form, Input } from "antd"
import Button from 'antd/lib/button';

export class FormPage extends React.Component<{}, {}> {
    public render() {
        return (
            <Form layout="inline" style={{ margin: "16px 16px" }}>
                <Form.Item label="required field">
                    <Input />
                </Form.Item>
                <Button />
            </Form>
        );
    }
}