import { ValidatorPage, ValidatorPageState } from "../components/pages/ValidatorPage";
import { stateProviders } from "./store";

export class DemoForm implements ValidatorPageState {
    userName: SubForm
    password: string
}

class SubForm {
    firstName: string
    lastName: string
}