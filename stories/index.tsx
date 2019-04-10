
import * as React from 'react';
import { TodoList } from '../src/components/pages/todo/TodoList';
import { StateProviders } from '../src/concept/auto';
import { storiesOf } from '@storybook/react';

const stateProviders = new StateProviders()
stateProviders.bind(TodoList, (props): TodoList['StateType'] => {
    return {
        todoItems: [{
            id: 0,
            key: 0,
            name: 'hello',
            isCompleted: false
        }],
        completeItem(recordId: number) {
        }
    }
})

storiesOf("TypeScript and Storybook", module)
    .add('Todo List', () => <TodoList {...stateProviders.props} />);