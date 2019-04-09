import * as React from "react"
import { Card, Table, Button, Modal, Input } from "antd"
import { fieldsOf } from "../../concept/fields";
import { AutoComponentProps, AutoComponent } from "../../concept/auto";
import { TodoList } from "./todo/TodoList"

interface State {
    newTaskName?: string
    modalVisible?: boolean
    addItem(): void
}

interface Props extends AutoComponentProps<State> {
}

export class TodoPage extends AutoComponent<Props, State> {
    public render() {
        return (
            <div>
                <Card bordered title="Todo List" style={{ margin: "16px 16px" }}>
                    <Button type="primary" icon="plus"
                        onClick={() => { this.setState({ modalVisible: true }); }}>New Task</Button>
                    <TodoList {...this.props}/>
                </Card>
                <Modal title="New Task" visible={this.state.modalVisible}
                    onOk={() => {
                        this.state.addItem()
                        this.setState({ modalVisible: false })
                    }}
                    onCancel={() => this.setState({ modalVisible: false })}>
                    <Input.TextArea placeholder="Input the name of the task" rows={4} {...fieldsOf(this).newTaskName} />
                </Modal>
            </div>
        );
    }
}