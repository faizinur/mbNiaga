import LocalizedStrings from 'react-localization';

let CustomToolbar = new LocalizedStrings({
    "ID": {
        emptyUsername: 'USERNAME tidak boleh kosong',
        errorUsername: 'USERNAME belum benar',
        linkDevice: 'DEVICE INFO',
        linkMenu: 'MENU',
        linkPIN: 'UBAH PIN',
        linkExit: 'KELUAR',
        usernameLabel: 'Nama User : ',
        logout: 'Keluar',
        cancel: 'Batal',
    },
    "EN": {
        emptyUsername: "USERNAME can't be empty",
        errorUsername: 'Incorrect USERNAME',
        linkDevice: 'DEVICE INFO',
        linkMenu: 'MENU',
        linkPIN: 'CHANGE PIN',
        linkExit: 'LOG OUT',
        usernameLabel: 'Username : ',
        logout: 'Log Out',
        cancel: 'Cancel',
    },
});

export default CustomToolbar;