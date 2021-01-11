import React from 'react';
import {
    Views,
    View,
    Toolbar,
    Link,
} from 'framework7-react';

class HomeTemplates extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <Views tabs className="safe-areas">
                <Toolbar tabbar labels bottom>
                    <Link tabLink="#view-home" tabLinkActive iconIos="f7:house_fill" iconAurora="f7:house_fill" iconMd="material:home" text="Home" />
                    <Link tabLink="#view-select" iconIos="f7:square_list_fill" iconAurora="f7:square_list_fill" iconMd="material:view_list" text="Select" />
                    <Link tabLink="#view-setting" iconIos="f7:gear" iconAurora="f7:gear" iconMd="material:settings" text="Setting" />
                </Toolbar>
                <View id="view-home" main tab tabActive url="/Main/" />
                <View id="view-select" name="select" tab url="/DaftarPin/" />
                <View id="view-setting" name="setting" tab url="/setting/" />
            </Views>
        )
    }
}

export default HomeTemplates;