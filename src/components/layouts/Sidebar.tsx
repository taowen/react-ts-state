import * as React from "react";
import { Layout, Menu, Icon } from "antd";
import { Link } from "react-router-dom";
import * as styles from "./Sidebar.css";

interface SidebarState {
    collapsed: boolean;
    mode: "vertical" | "inline" | "horizontal" | undefined;
}

class Sidebar extends React.Component<{}, SidebarState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            collapsed: false,
            mode: "inline",
        };
    }

    public render() {
        return (
            <Layout.Sider collapsible collapsed={this.state.collapsed} onCollapse={this.toggle}>
                <div className={styles.antLayoutIcon}/>
                <Menu theme="dark" mode={this.state.mode} defaultSelectedKeys={["1"]}>
                    <Menu.Item key="1">
                        <Link to="/home">
                            <Icon type="home" />
                            <span className="nav-text">Home</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <Link to="/todo">
                            <Icon type="check-square-o" />
                            <span className="nav-text">Todo</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <Link to="/form">
                            <Icon type="file" />
                            <span className="nav-text">Form</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="4">
                        <Link to="/validator">
                            <Icon type="check" />
                            <span className="nav-text">Validator</span>
                        </Link>
                    </Menu.Item>
                </Menu>
                <div className={styles.siderTrigger}>
                    <Icon
                        className="trigger"
                        type={this.state.collapsed ? "menu-unfold" : "menu-fold"}
                        onClick={this.toggle} />
                </div>
            </Layout.Sider>
        );
    }

    private toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
            mode: !this.state.collapsed ? "vertical" : "inline",
        });
    }
}

export default Sidebar;