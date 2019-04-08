import * as React from "react";
import { HashRouter } from "react-router-dom";
import { LocaleProvider } from "antd";
import enUS from "antd/lib/locale-provider/en_US";
import { route } from "./routes";

export class App extends React.Component<{}, {}> {
    public render(): JSX.Element {
        return (
            <LocaleProvider locale={enUS}>
                <HashRouter children={route} />
            </LocaleProvider>
        );
    }
}