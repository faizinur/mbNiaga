import React, { Component } from 'react';
import { f7 } from 'framework7-react';
import {log} from '../../../utils/'
const mwRequestAndLoad = (routeTo, routeFrom, resolve, reject, component) => {
    // Show Preloader
    f7.preloader.show();

    // User ID from request
    var userId = routeTo.params.userId;
    // Simulate Ajax Request
    setTimeout(function () {
        // We got user data from request
        var user = {
            firstName: 'Vladimirs',
            lastName: 'Kharlampidi',
            about: 'Hello, i am creator of Framework7! Hope you like it!',
            links: [
                {
                    title: 'Framework7 Website',
                    url: 'http://framework7.io',
                },
                {
                    title: 'Framework7 Forum',
                    url: 'http://forum.framework7.io',
                },
            ]
        };

        // //decrypt
        // let formdata = new FormData();
        // formdata.append('msg', Encrypt(user));
        // log(formdata);
        // API.post(`users`, Encrypt(user)).then(res => log(res))

        // hide Preloader
        f7.preloader.hide();
        // reject();

        // Resolve route to load page
        resolve(
            {
                component: component,
            },
            {
                context: {
                    user: user,
                }
            }
        );
    }, 1000);
}

export default mwRequestAndLoad;