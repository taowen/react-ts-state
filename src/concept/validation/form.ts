export function form<T extends { new(...args: any[]): {} }>(target: T) {
    return class extends target {
        constructor(...args: any[]) {
            super(...args)
            // so all methods can be accessed as properties
            const proto = Object.getPrototypeOf(Object.getPrototypeOf(this))
            for (const k of Object.getOwnPropertyNames(proto)) {
                if (typeof proto[k] === 'function') {
                    (this as any)[k] = proto[k].bind(this)
                }
            }
        }
    }
}