import { Button, Card } from "antd";
import * as React from "react";
import { AutoComponent, AutoComponentProps } from "../../concept/auto";
import { NewTodo } from "./todo/NewTodo";
import { TodoList } from "./todo/TodoList";

interface Props extends AutoComponentProps<State> {
}

interface State {
    pendingItemsCount: number
    totalItemsCount: number
    addNewTodo(): void
}

export class TodoPage extends AutoComponent<Props, State> {
    public render() {
        let state = this.state
        return (
            <div>
                <Card bordered title={`Todo List (${state.pendingItemsCount} / ${state.totalItemsCount})`} style={{ margin: "16px 16px" }}>
                    <Button type="primary" icon="plus"
                        onClick={() => { state.addNewTodo() }}>New Task</Button>
                    <TodoList {...this.props} />
                </Card>
                <NewTodo {...this.props} />
            </div>
        );
    }
}