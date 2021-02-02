import React, { useEffect } from 'react'
import { log, Geolocation } from '../../../utils';

const Maps = (props) => {
    useEffect(() => {
        log('MOUNT OR UPDATE Maps');
        openMaps();
        return () => {
            log('UNMOUNT Maps');
        }
    }, [])
    const openMaps = () => {
        let elem = document.getElementById("map_canvas_kunjungan");
        Geolocation.getMapLocation(elem)
        .then(res => {
            elem.style.height = '30vh';
            elem.style.width = '100%';
        })
        .catch(err => log(err));
    }

    return (
        <div id="map_canvas_kunjungan"></div>
    )
}


export default Maps;

