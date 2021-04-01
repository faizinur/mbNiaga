import React, { useEffect, useState, forwardRef, useRef, useImperativeHandle } from 'react';
import { log, uuid } from '../../../utils/';
import {
    Page,
    Navbar,
    Block,
    Button,
    Popup,
    NavRight,
    Link,
    BlockTitle,
    f7,
} from 'framework7-react';

const Camera = forwardRef((props, ref) => {
    useEffect(() => {
        log('MOUNT OR UPDATE Camera');
        return () => {
            log('UNMOUNT Camera');
        }
    }, [])

    let [active, setActive] = useState(false);
    let [index, setIndex] = useState(false);
    let [navbarHeight, setNavbarHeight] = useState(false);
    let { height, width } = window.screen;
    let { onError, onResult } = props;
    useImperativeHandle(ref, () => ({
        start(index = null) {
            log('start : ', index)
            setIndex(index);
            setActive(true);
            let camHeight = window.screen.height;
            let camWidth = window.screen.width;
            camHeight = parseInt(4 / 3 * camWidth);
            let s_bgsize = camWidth + "px " + camHeight + "px";
            setNavbarHeight(height - camHeight);
            let options = {
                x: 0,
                y: 0,
                width: camWidth,
                height: camHeight,
                camera: CameraPreview.CAMERA_DIRECTION.BACK,
                toBack: false,
                tapPhoto: false,
                tapFocus: true,
                previewDrag: false,
                storeToFile: false,
                disableExifHeaderStripping: false
            };
            CameraPreview
                .startCamera(
                    options,
                    success => log(success),
                    err => {
                        setActive(true);
                        onError(err);
                    }
                );
        },
        stop() {
            log('stop')
            setActive(false);
            setIndex(null);
            // CameraPreview.stopCamera();
        },
        _getBase64(uri, onDone) {
            f7.preloader.show();
        },
        async _getBase64(uri) {
            return new Promise((resolve, reject) => {
                if (uri.includes('file:')) {
                    CameraPreview.getBlob(
                        uri,
                        function (blob) {
                            let reader = new FileReader();
                            reader.readAsDataURL(blob);
                            reader.onloadend = function () {
                                f7.preloader.hide();
                                resolve(reader.result);
                            };
                        });
                } else {
                    f7.preloader.hide();
                    resolve(uri)
                }
            });
        }
    }));

    const _takePicture = () => {
        CameraPreview.getSupportedPictureSizes(
            function (dimensions) {
                log('dimensions ' + JSON.stringify(dimensions));
                let w = 8;
                let h = 6;
                let s_img_size = "null";
                //let s_ar = window.screen.width / window.screen.height;
                log('start looping...');
                //find largest H and W
                dimensions.forEach(function (dimension) {
                    log('dimension ' + JSON.stringify(dimension));
                    let c_ar = dimension.width / dimension.height;
                    let d_ar = c_ar - (4 / 3);
                    if (d_ar < 0) {
                        d_ar = d_ar * (-1);
                    }
                    if ((d_ar <= 0.000001)) {
                        if ((parseInt(dimension.width) >= 900) && (parseInt(dimension.width) < 2000)) {
                            if (parseInt(dimension.width) > w) {
                                h = parseInt(dimension.height);
                                w = parseInt(dimension.width);
                                s_img_size = 'taking image ' + w + ' x ' + h;
                            }
                        }
                    }
                });
                _do_takePicture(w, h);
            },
            function () {
                log("Error on getSupportedPictureSizes");
            }
        );
    }
    const _do_takePicture = (w, h) => {
        CameraPreview
            .takePicture({ width: w, height: h, quality: 85 },
                function (data) {
                    CameraPreview.stopCamera();
                    log('stop');
                    setActive(false);
                    setIndex(null);
                    let result = {
                        index: index,
                        base64: `data:image/jpeg;base64${data[0]}`,
                    };
                    onResult(result)
                },
                function () {
                    onError(err)
                }
            );
    }
    const _cancel = () => {
        log('_cancel')
        setActive(false);
        setIndex(null);
        CameraPreview.stopCamera();
    }

    return (
        <Popup
            className="camera-popup"
            opened={active}
            onPopupClosed={() => log('pop up Closed')}
            style={{ backgroundColor: 'black' }}
        >
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ display: 'flex', backgroundColor: '#c0392b', bottom: 0, left: 0, height: navbarHeight, width: width }}>
                    <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }} />
                    <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <div onClick={() => _takePicture()} style={{ height: 70, width: 70, backgroundColor: 'blue', borderRadius: 35 }} />
                    </div>
                    <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <div onClick={() => _cancel()} style={{ height: 50, width: 50, backgroundColor: 'pink', borderRadius: 25 }} />
                    </div>
                </div>
            </div>
        </Popup>
    )
})

export default Camera;
