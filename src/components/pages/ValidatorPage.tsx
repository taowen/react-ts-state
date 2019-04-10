import { Button, Form } from "antd";
import * as React from "react";
import { AutoComponent } from "../../concept/auto";
import { fieldsOf } from "../../concept/fields";
import { VInput } from "../../concept/validate";

interface Props {
}

export interface State {
    userName: {
        firstName: string,
        lastName: string
    }
    password: string
}

class ValidatorPage extends AutoComponent<Props, State> {

    public render() {
        return (
            <Form style={{ margin: "16px 16px" }} layout="inline">
                <VInput label="frist name" field={fieldsOf(this).userName.firstName} />
                <VInput label="last name" field={fieldsOf(this).userName.lastName} />
                <VInput label="password" field={fieldsOf(this).password} />
                <Form.Item>
                    <Button type="primary" htmlType="submit" onClick={() => { alert(JSON.stringify(this.state)) }}>Submit</Button>
                </Form.Item>
            </Form>
        )
    }
}

export { ValidatorPage };
export { ValidatorPage as Comp };

