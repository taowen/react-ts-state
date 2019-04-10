import * as mobx from "mobx"
import * as React from "react"

export class StateProviders {

    stateProviders = new Map<Function, (props: any) => any>()

    bind<P, S>(componentClass: React.ComponentClass<P, S>, stateProvider: (props: P) => S) {
        this.stateProviders.set(componentClass, stateProvider)
    }

    getState<P, S>(componentClass: React.ComponentClass<P, S>, props: P): S {
        let stateProvider = this.stateProviders.get(componentClass)
        if (!stateProvider) {
            throw new Error('did not bindState for class ' + componentClass.name)
        }
        return stateProvider(props)
    }

    get props() {
        return { getState: this.getState.bind(this) }
    }
}

export interface AutoComponentProps<S> {
    getState: <P, S>(componentClass: React.ComponentClass<P, S>, props: P) => S
}

export abstract class AutoComponent<P, S> extends React.Component<P & AutoComponentProps<S>, S> {

    private disposeAutoRun: mobx.IReactionDisposer | null = null;
    StateType: S // to allow reference S via Component['StateType']

    constructor(props: P & AutoComponentProps<S>) {
        super(props)
        const thisClass = this.constructor as React.ComponentClass<P, S>
        this.state = props.getState(thisClass, props)
    }

    componentDidMount() {
        const thisClass = this.constructor as React.ComponentClass<P, S>
        const thisProps = this.props as any
        this.disposeAutoRun = mobx.autorun(() => {
            this.setState(thisProps.getState(thisClass, this.props))
        })
    }

    componentWillUnmount() {
        if (this.disposeAutoRun) {
            this.disposeAutoRun()
        }
    }
}