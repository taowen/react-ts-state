import * as React from "react";
import { RouteConfig } from "react-router-config";
import { Route, Switch } from "react-router-dom";
import PageLayout from "./layouts/PageLayout";
import { FormPage } from "./pages/FormPage";
import { HomePage } from "./pages/HomePage";

export const routes: RouteConfig[] = [
    {
        path: "/home",
        exact: true,
        component: () => (<HomePage />),
    },
    {
        path: "/todo",
        component: () => (<p />),
    },
    {
        path: "/form",
        component: () => (<FormPage />),
    },
];

export const route = (
    <Switch>
        <Route path="/" component={PageLayout} />
    </Switch>
);
