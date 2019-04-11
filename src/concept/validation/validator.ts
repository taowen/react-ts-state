import { ValidateStatus, FieldValidator } from "./field";

export function byRegex(regex: RegExp, options?: {
    validateStatus?: ValidateStatus
    help?: string
}): FieldValidator {
    return (val, fieldOptions) => {
        if (val && regex.test(val)) {
            return { validateStatus: 'success' }
        }
        if (!options) {
            options = {}
        }
        let help = options.help
        if (!help) {
            help = `${fieldOptions.label} does not match regular expression ${regex}`
        }
        return {
            validateStatus: options.validateStatus || 'error',
            help: help
        }
    }
}