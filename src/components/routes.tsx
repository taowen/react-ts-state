import * as React from "react";
import { RouteConfig } from "react-router-config";
import { Route, Switch } from "react-router-dom";
import PageLayout from "./layouts/PageLayout";

export const routes: RouteConfig[] = [
    {
        path: "/home",
        exact: true,
        component: () => (<p />),
    },
    {
        path: "/todo",
        component: () => (<p />),
    },
    {
        path: "/about",
        component: () => (<p />),
    },
];

export const route = (
    <Switch>
        <Route path="/" component={PageLayout} />
    </Switch>
);
