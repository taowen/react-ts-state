import * as React from "react";
import { RouteConfig } from "react-router-config";
import { Route, Switch } from "react-router-dom";
import PageLayout from "./layouts/PageLayout";
import { AboutPage } from "./pages/AboutPage";
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
        path: "/about",
        component: () => (<AboutPage />),
    },
];

export const route = (
    <Switch>
        <Route path="/" component={PageLayout} />
    </Switch>
);
