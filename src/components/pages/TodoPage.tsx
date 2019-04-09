import * as React from "react"
import { Card, Table, Button, Modal, Input } from "antd"
import { fieldsOf } from "../../concept/fields";
import { AutoComponentProps, AutoComponent } from "../../concept/auto";

const { Column } = Table

interface TodoItem {
    id: number
    key: number
    name: string
    isCompleted: boolean
}

interface State {
    todoItems: TodoItem[]
    newTaskName?: string
    modalVisible?: boolean
    addItem(): void
    completeItem(recordId: number): void
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
                    <Table dataSource={this.state.todoItems}>
                        <Column title="Id" dataIndex="id" key="id"></Column>
                        <Column title="Task" dataIndex="name" key="name"></Column>
                        <Column title="Status" dataIndex="isCompleted" key="isCompleted"
                            render={(text: any, record: TodoItem, index: number) => {
                                return <span>{record.isCompleted ? "Completed" : "Pending"}</span>;
                            }}></Column>
                        <Column title="Action" key="action" render={(text: any, record: TodoItem, index: number) => (
                            <Button type="primary" disabled={record.isCompleted}
                                onClick={() => {
                                    this.state.completeItem(record.id)
                                }}>Complete</Button>
                        )} />
                    </Table>
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