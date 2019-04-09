import { observable } from "mobx";
import { StateProviders } from "../concept/auto";
import { TodoPage } from "../components/pages/TodoPage";
import * as mobx from "mobx"

export class TodoItem {

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

export const store = new Store() // the domain model

export const stateProviders = new StateProviders() // bind domain model into various view model

stateProviders.bind(TodoPage, (props): TodoPage['StateType'] => {
    return {
        todoItems: mobx.toJS(store.todoItems), // watch them all
        addItem(): void {
            store.todoItems.push(new TodoItem({
                id: store.todoItems.length,
                key: store.todoItems.length,
                name: this.newTaskName!,
                isCompleted: false
            }))
            this.newTaskName = ''
        },
        completeItem(recordId: number): void {
            store.todoItems[recordId].isCompleted = true
        }
    }
})