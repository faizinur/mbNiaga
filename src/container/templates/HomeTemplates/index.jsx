import React from 'react';
import {
    Views,
    View,
    Toolbar,
    Link,
    Page,
} from 'framework7-react';


export default ({ f7router }) => {
    return (
        <Page name="HomeTemplates">
            {/* <Navbar title="About" /> */}
            <Views tabs className="safe-areas">
                <Toolbar tabbar labels bottom>
                    <Link tabLink="#view-menu" tabLinkActive iconIos="f7:house_fill" iconAurora="f7:house_fill" iconMd="material:home" text="Menu" />
                    <Link tabLink="#view-ubah_pin" iconIos="f7:square_list_fill" iconAurora="f7:square_list_fill" iconMd="material:view_list" text="Ubah PIN" />
                    <Link tabLink="#view-logout" iconIos="f7:gear" iconAurora="f7:gear" iconMd="material:settings" text="Log Out" />
                </Toolbar>
                <View id="view-menu" main tab tabActive url="/Main/" />
                <View id="view-ubah_pin" name="select" tab url="/DaftarPin/" />
                <View id="view-logout" name="setting" tab url="/setting/" />
            </Views>
        </Page>
    )
}