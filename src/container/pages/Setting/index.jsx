import React, { useEffect, useState } from 'react';
import {
    Page,
    Navbar,
    NavLeft,
    NavTitle,
    NavTitleLarge,
    NavRight,
    BlockTitle,
    List,
    ListInput,
} from 'framework7-react';

import { useDispatch, useSelector } from "react-redux";
import { increment, decrement } from "../../../config/redux/actions/counterActions";


const Setting = () => {
    useEffect(() => {
        console.log('MOUNT OR UPDATE SETTING');
        return () => {
            console.log('UNMOUNT SETTING');
        }
    }, [])

    const [name, setName] = useState('Jhon Doe');

    const count = useSelector(state => state.counter.counter);
    const dispatch = useDispatch();

    const incrementVal = data => dispatch(increment(data))
    const decrementVal = data => dispatch(decrement(data))

    return (
        <Page name="setting">
            {/* Top Navbar */}
            <Navbar large sliding={false}>
                <NavLeft>
                    {/* <Link iconIos="f7:menu" iconAurora="f7:menu" iconMd="material:menu" panelOpen="left" /> */}
                </NavLeft>
                <NavTitle sliding>mobCollNiaga</NavTitle>
                <NavRight>
                    {/* <Link iconIos="f7:menu" iconAurora="f7:menu" iconMd="material:menu" panelOpen="right" /> */}
                </NavRight>
                <NavTitleLarge>mobCollNiaga</NavTitleLarge>
            </Navbar>
            <BlockTitle>Setting</BlockTitle>
            <p>Jumlah Counter : {count}</p>
            <button onClick={() => incrementVal(1)}>+</button>
            <button onClick={() => decrementVal(1)}>-</button>

            <br />
            <br />
            <br />

            <p>Name : {name}</p>
            <List noHairlinesMd>
                <ListInput
                    label="Password"
                    type="text"
                    placeholder="Your password"
                    value={name}
                    clearButton
                    onChange={({ target }) => setName(target.value)}
                />
            </List>
        </Page>
    )
}

export default Setting;
