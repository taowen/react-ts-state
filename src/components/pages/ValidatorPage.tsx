import { Button, Form } from "antd";
import * as React from "react";
import { AutoComponent } from "../../concept/AutoComponent";
import { fieldsOf } from "../../concept/FieldRef";
import { VInput } from "../../concept/validation/WithValidation";

interface Props {
}

export interface State {
    userName: {
        firstName: string,
        lastName: string
    }
    password: string
    onSubmit(): void
}

class ValidatorPage extends AutoComponent<Props, State> {

    public render() {
        return (
            <Form style={{ margin: "16px 16px" }} layout="inline">
                <VInput field={fieldsOf(this).userName.firstName} />
                <VInput field={fieldsOf(this).userName.lastName} />
                <VInput field={fieldsOf(this).password} />
                <Form.Item>
                    <Button type="primary" htmlType="submit" onClick={() => { this.state.onSubmit() }}>Submit</Button>
                </Form.Item>
            </Form>
        )
    }
}

export { ValidatorPage };
export { ValidatorPage as Comp };

