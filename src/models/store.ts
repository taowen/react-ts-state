import * as mobx from "mobx";
import { observable } from "mobx";
import { NewTodo } from "../components/pages/todo/NewTodo";
import { TodoList } from "../components/pages/todo/TodoList";
import { TodoPage } from "../components/pages/TodoPage";
import { StateProviders } from "../concept/auto";

class Store {
    @observable
    todoItems: TodoItem[] = []

    @observable
    addingNewTodo: boolean
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

export const store = new Store() // the domain model

export const stateProviders = new StateProviders() // bind domain model into various view model

stateProviders.bind(TodoPage, (props): TodoPage['StateType'] => {
    return {
        addNewTodo() {
            store.addingNewTodo = true
        },
        totalItemsCount: store.todoItems.length,
        pendingItemsCount: store.todoItems.filter((item) => !item.isCompleted).length
    }
})

stateProviders.bind(NewTodo, (props): NewTodo['StateType'] => {
    return {
        addItem(): void {
            store.todoItems.push(new TodoItem({
                id: store.todoItems.length,
                key: store.todoItems.length,
                name: this.newTaskName!,
                isCompleted: false
            }))
            this.newTaskName = ''
        },
        close() {
            store.addingNewTodo = false
        },
        isOpen: store.addingNewTodo
    }
})

stateProviders.bind(TodoList, (props) => {
    return {
        todoItems: mobx.toJS(store.todoItems), // watch them all
        completeItem(recordId: number): void {
            store.todoItems[recordId].isCompleted = true
        }
    }
})