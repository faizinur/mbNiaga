import LocalizedStrings from 'react-localization';

let Idle = new LocalizedStrings({
    "ID": {
        pinLabel : 'PIN :',
        passwordLabel : 'Password :',
        login : 'Masuk',
        exit : 'Keluar',
        exitConfirm : 'Keluar dan hapus data ?',
        uploadConfirm : 'Unggah data tertunda?',
        exitTitle : 'Masukkan Username dan Password',
        inputAlertOnline : 'Harap isi username dan password.',
        inputAlertOffline : 'Harap isi PIN',
    },
    "EN": {
        pinLabel : 'PIN :',
        passwordLabel : 'Password :',
        login : 'Login',
        exit : 'Exit',
        exitConfirm : 'Log Out and Clear Data ?',
        uploadConfirm : 'Upload delayed data ?',
        exitTitle : 'Input Username and Password',
        inputAlertOnline : 'Fill username and password.',
        inputAlertOffline : 'Fill PIN.',
    },
});

export default Idle;