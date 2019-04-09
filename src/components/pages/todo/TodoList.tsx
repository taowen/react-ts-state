import * as React from "react"
import { Card, Table, Button, Modal, Input } from "antd"
import { fieldsOf } from "../../../concept/fields";
import { AutoComponentProps, AutoComponent } from "../../../concept/auto";

const { Column } = Table

interface TodoItem {
    id: number
    key: number
    name: string
    isCompleted: boolean
}

interface State {
    todoItems: TodoItem[]
    completeItem(recordId: number): void
}

interface Props extends AutoComponentProps<State> {
}

export class TodoList extends AutoComponent<Props, State> {

    public render() {
        return (
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
        );
    }
}