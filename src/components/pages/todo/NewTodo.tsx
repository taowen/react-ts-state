import { Input, Modal } from "antd";
import * as React from "react";
import { AutoComponent, AutoComponentProps } from "../../../concept/auto";
import { fieldsOf } from "../../../concept/fields";

interface Props extends AutoComponentProps<State> {
}

interface State {
    newTaskName?: string
    isOpen: boolean
    addItem(): void
    close(): void
}

export class NewTodo extends AutoComponent<Props, State> {
    public render() {
        return (
            <Modal title="New Task" visible={this.state.isOpen}
                onOk={() => {
                    this.state.addItem()
                    this.state.close()
                }}
                onCancel={() => this.state.close()}>
                <Input.TextArea placeholder="Input the name of the task" rows={4} {...fieldsOf(this).newTaskName} />
            </Modal>
        );
    }
}