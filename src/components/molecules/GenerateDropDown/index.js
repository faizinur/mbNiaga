import React, { useEffect, useState } from 'react';
import {
    List,
    ListInput,
} from 'framework7-react';
import uuid from '../../../utils/uuid'

const GenerateDropDown = (props) => {
    useEffect(() => {
        console.log('MOUNT OR UPDATE SELECT GenerateDropDown', props);
        return () => {
            console.log('UNMOUNT SELECT GenerateDropDown', props);
        }
    }, [props])

    return (
        <List inlineLabels noHairlinesMd style={{ margin: 0 }}>
            <ListInput
                // label="selectF7"
                type="select"
                defaultValue={props.defaultValue}
                placeholder={props.placeholder}
                onChange={({ target }) => props.onChange(target.value)}
            >
                <option key={uuid()} value="" disabled>{props.placeholder}</option>
                {props.data.map(item => <option key={uuid()} value={item.id}>{item.value}</option>)}
            </ListInput>
        </List>
    )
}

export default GenerateDropDown;