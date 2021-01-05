
// import { Encrypt, Decrypt } from '../../../utils/Encryption/';
// import API from '../../../utils/API';

const mwRequestAndLoad = (routeTo, routeFrom, resolve, reject, component, context) => {
    // Middleware instance
    var middleware = context;

    // App instance
    var app = middleware.app;

    // Show Preloader
    app.preloader.show();

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
        // console.log(formdata);
        // API.post(`users`, Encrypt(user)).then(res => console.log(res))

        // hide Preloader
        app.preloader.hide();
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