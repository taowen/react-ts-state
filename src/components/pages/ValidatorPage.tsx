import { Button, Form, Select } from "antd";
import * as React from "react";
import { AutoComponent } from "../../concept/AutoComponent";
import { fieldsOf } from "../../concept/FieldRef";
import { VInput, VSelect, VDatePicker } from "../../concept/validation/WithValidation";
import { Moment } from "moment";

interface Props {
}

export interface State {
    userName: {
        firstName: string
        lastName: string
    }
    password: string
    interests: string[]
    deliveryDate: Moment
    onSubmit(): void
}

class ValidatorPage extends AutoComponent<Props, State> {

    public render() {
        return (
            <Form style={{ margin: "16px 16px" }} layout="vertical">
                <VInput field={fieldsOf(this).userName.firstName} />
                <VInput field={fieldsOf(this).userName.lastName} />
                <VInput field={fieldsOf(this).password} />
                <VSelect field={fieldsOf(this).interests} mode="multiple" >
                    <Select.Option key="a1">a1</Select.Option>
                    <Select.Option key="a2">a2</Select.Option>
                    <Select.Option key="a3">a3</Select.Option>
                    <Select.Option key="a4">a4</Select.Option>
                    <Select.Option key="a5">a5</Select.Option>
                </VSelect>
                <VDatePicker field={fieldsOf(this).deliveryDate} />
                <Form.Item>
                    <Button type="primary" htmlType="submit" onClick={() => { this.state.onSubmit() }}>Submit</Button>
                </Form.Item>
            </Form>
        )
    }
}

export { ValidatorPage };
export { ValidatorPage as Comp };

