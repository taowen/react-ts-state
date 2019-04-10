import * as React from "react";
import { RouteConfig } from "react-router-config";
import { Route, Switch } from "react-router-dom";
import { stateProviders } from "../models/store";
import PageLayout from "./layouts/PageLayout";
import { FormPage } from "./pages/FormPage";
import { HomePage } from "./pages/HomePage";
import { TodoPage } from "./pages/TodoPage";
import { ValidatorPage } from "./pages/ValidatorPage";

export const routes: RouteConfig[] = [
    {
        path: "/home",
        exact: true,
        component: () => (<HomePage />),
    },
    {
        path: "/todo",
        component: () => (<TodoPage {...stateProviders.props}/>),
    },
    {
        path: "/form",
        component: () => (<FormPage />),
    },
    {
        path: "/validator",
        component: () => (<ValidatorPage />),
    },
];

export const route = (
    <Switch>
        <Route path="/" component={PageLayout} />
    </Switch>
);
