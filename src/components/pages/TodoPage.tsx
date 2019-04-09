import * as React from "react"
import { Card, Table, Button, Modal, Input } from "antd"
import * as mobx from "mobx"
import { fieldsOf } from "../../concept/fields";

const { Column } = Table

export interface TodoItem {
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
    completeItem(record: TodoItem): void
}

interface Props extends AutoComponentProps<State> {
}

interface AutoComponentProps<S> {
    getState: <P, S>(componentClass: React.ComponentClass<P, S>, props: P) => S
}

abstract class AutoComponent<P extends AutoComponentProps<S>, S> extends React.Component<P, S> {

    private disposeAutoRun: mobx.IReactionDisposer|null = null;

    constructor(props: P) {
        super(props)
        const thisClass = this.constructor as React.ComponentClass<P, S>
        this.state = props.getState(thisClass, props)
    }

    componentDidMount() {
        const thisClass = this.constructor as React.ComponentClass<P, S>
        this.disposeAutoRun = mobx.autorun(() => {
            this.setState(this.props.getState(thisClass, this.props))
        })
    }

    componentWillUnmount() {
        if (this.disposeAutoRun) {
            this.disposeAutoRun()
        }
    }
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
                                    this.state.completeItem(record)
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