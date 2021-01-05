import React, { useEffect, useState } from 'react'
import {
    Page,
    List,
    ListInput,
    Button,
} from 'framework7-react';
import { useDispatch, useSelector } from "react-redux";
import { GenerateDropDown } from '../../../components/molecules';
import uuid from '../../../utils/uuid/';

const Select = (props) => {
    // console.log('Select props: ', props);
    useEffect(() => {
        console.log('MOUNT OR UPDATE SELECT');
        return () => {
            console.log('UNMOUNT SELECT');
        }
    }, [provinceCode, regencyCode, districtCode, subDstrictCode])

    const provinceData = useSelector(state => state.region.province);
    const regencyData = useSelector(state => state.region.regency);
    const districtData = useSelector(state => state.region.district);
    const subDistrictData = useSelector(state => state.region.subDistrict);

    const [provinceCode, setProvinceCode] = useState("");
    const [regencyCode, setRegencyCode] = useState("");
    const [districtCode, setDistrictCode] = useState("");
    const [subDstrictCode, setSubDistrictCode] = useState("");

    return (
        <Page name="select">
            <p>province : {provinceCode}</p>
            <p>regency : {regencyCode}</p>
            <p>disctrict : {districtCode}</p>
            <List inlineLabels noHairlinesMd style={{ margin: 0 }}>
                <ListInput
                    type="select"
                    defaultValue={""}
                    placeholder={'--pilih--'}
                    onChange={({ target }) => {
                        console.log(target.value)
                        setProvinceCode(target.value);
                        setRegencyCode("");
                    }}
                    onBlur={({ target }) => console.log('blur', target.value)}
                >
                    <option key={0} value="" disabled>--pilih--</option>
                    {provinceData.map(item => <option key={uuid()} value={item.code}>{item.description}</option>)}
                </ListInput>
                <ListInput
                    type="select"
                    defaultValue={""}
                    placeholder={'--pilih--'}
                    onChange={({ target }) => {
                        console.log(target.value)
                        setRegencyCode(target.value);
                    }}
                    onBlur={({ target }) => console.log('blur', target.value)}
                >
                    <option key={0} value="" disabled>--pilih--</option>
                    {
                        regencyData.filter(item => { return item.parent_code == provinceCode })
                            .map(item => <option key={uuid()} value={item.code}>{item.description}</option>)
                    }
                </ListInput>
                <Button onClick={() => setRegencyCode("")} round>setRegencyCode</Button>
            </List>
        </Page>
    )
}

export default Select;
