import * as React from "react";
import { RouteConfig } from "react-router-config";
import { Route, Switch } from "react-router-dom";
import PageLayout from "./layouts/PageLayout";
import { FormPage } from "./pages/FormPage";
import { HomePage } from "./pages/HomePage";
import { TodoPage } from "./pages/TodoPage";
import {observable} from "mobx"
import * as mobx from "mobx"

const stateProviders = new Map<Function, (props: any) => any>()

function bindState<P, S>(componentClass: React.ComponentClass<P, S>, stateProvider: (props: P) => S) {
    stateProviders.set(componentClass, stateProvider)
}

class TodoItem {

    @observable
    id: number = 0
    @observable
    key: number = 0
    @observable
    name: string = ''
    @observable
    isCompleted: boolean = false

    constructor(init?: Partial<TodoItem>) {
        Object.assign(this, init);
    }
}

class Store {
    @observable
    todoItems: TodoItem[] = []
}

const store = new Store()

bindState(TodoPage, (props): TodoPage['state'] => {
    return {
        todoItems: mobx.toJS(store.todoItems), // watch them all
        addItem(): void {
            store.todoItems.push(new TodoItem({
                id: store.todoItems.length,
                key: store.todoItems.length,
                name: this.newTaskName!,
                isCompleted: false
            }))
        },
        completeItem(record: TodoItem): void {
            store.todoItems[record.id].isCompleted = true
        }
    }
})

function getState<P, S>(componentClass: React.ComponentClass<P, S>, props: P): S {
    let stateProvider = stateProviders.get(componentClass)
    if (!stateProvider) {
        throw new Error('did not bindState for class ' + componentClass.name)
    }
    return stateProvider(props)
}

export const routes: RouteConfig[] = [
    {
        path: "/home",
        exact: true,
        component: () => (<HomePage />),
    },
    {
        path: "/todo",
        component: () => (<TodoPage getState={getState}/>),
    },
    {
        path: "/form",
        component: () => (<FormPage />),
    },
];

export const route = (
    <Switch>
        <Route path="/" component={PageLayout} />
    </Switch>
);
