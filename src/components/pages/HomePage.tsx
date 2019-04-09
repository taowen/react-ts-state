import * as React from "react";
import { Card, Input } from "antd";

export class HomePage extends React.Component<{}, {}> {
    public render() {
        return (
            <Card bordered title="Hello React & Antd" style={{ margin: "16px 16px" }}>
                <p>Happy coding!</p>
            </Card>
        );
    }
}