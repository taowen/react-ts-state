import { Button, Table } from "antd";
import * as React from "react";
import { AutoComponent } from "../../../concept/auto";

const { Column } = Table

interface Props {
}

interface State {
    todoItems: TodoItem[]
    completeItem(recordId: number): void
}

interface TodoItem {
    id: number
    key: number
    name: string
    isCompleted: boolean
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