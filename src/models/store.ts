import * as mobx from "mobx";
import { observable, computed } from "mobx";
import { NewTodo } from "../components/pages/todo/NewTodo";
import { TodoList } from "../components/pages/todo/TodoList";
import { TodoPage } from "../components/pages/TodoPage";
import { StateProviders } from "../concept/auto";

class Store {

    @observable
    todoItems: TodoItem[] = []

    @observable
    addingNewTodo: boolean

    @computed
    get totalItemsCount() {
        return store.todoItems.length
    }

    @computed
    get pendingItemsCount() {
        return store.todoItems.filter((item) => !item.isCompleted).length
    } 

    completeItem(recordId: number) {
        this.todoItems[recordId].isCompleted = true
    }

    addItem(newTaskName: string) {
        this.todoItems.push(new TodoItem({
            id: store.todoItems.length,
            key: store.todoItems.length,
            name: newTaskName,
            isCompleted: false
        }))
    }
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

// the domain model
export const store = new Store() 
// bind domain model into various view model
export const stateProviders = new StateProviders() 

stateProviders.bind(TodoPage, (props): TodoPage['StateType'] => {
    return {
        addNewTodo() {
            store.addingNewTodo = true
        },
        totalItemsCount: store.totalItemsCount,
        pendingItemsCount: store.pendingItemsCount
    }
})

stateProviders.bind(NewTodo, (props): NewTodo['StateType'] => {
    return {
        onOk(): void {
            store.addItem(this.newTaskName!)
            this.newTaskName = ''
            store.addingNewTodo = false
        },
        onCancel() {
            store.addingNewTodo = false
        },
        isOpen: store.addingNewTodo
    }
})

stateProviders.bind(TodoList, (props) => {
    return {
        todoItems: mobx.toJS(store.todoItems), // watch them all
        completeItem(recordId: number): void {
            store.completeItem(recordId)
        }
    }
})