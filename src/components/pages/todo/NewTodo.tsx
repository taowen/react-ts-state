import { Input, Modal } from "antd";
import * as React from "react";
import { AutoComponent } from "../../../concept/AutoComponent";
import { fieldsOf } from "../../../concept/FieldRef";

interface Props {
}

interface State {
    newTaskName?: string
    isOpen: boolean
    onOk(): void
    onCancel(): void
}

export class NewTodo extends AutoComponent<Props, State> {
    public render() {
        return (
            <Modal title="New Task" visible={this.state.isOpen}
                onOk={() => { this.state.onOk() }}
                onCancel={() => this.state.onCancel()}>
                <Input.TextArea placeholder="Input the name of the task" rows={4} {...fieldsOf(this).newTaskName} />
            </Modal>
        );
    }
}