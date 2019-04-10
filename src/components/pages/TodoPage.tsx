import { Button, Card } from "antd";
import * as React from "react";
import { AutoComponent, AutoComponentProps } from "../../concept/auto";
import { NewTodo } from "./todo/NewTodo";
import { TodoList } from "./todo/TodoList";

interface Props extends AutoComponentProps<State> {
}

interface State {
    addNewTodo(): void
}

export class TodoPage extends AutoComponent<Props, State> {
    public render() {
        return (
            <div>
                <Card bordered title="Todo List" style={{ margin: "16px 16px" }}>
                    <Button type="primary" icon="plus"
                        onClick={() => { this.state.addNewTodo() }}>New Task</Button>
                    <TodoList {...this.props}/>
                </Card>
                <NewTodo {...this.props} />
            </div>
        );
    }
}