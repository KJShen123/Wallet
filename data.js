const sql = require('mssql');

const dbConfigWallet = {
    user: '',
    password: '',
    server: '127.0.0.1',
    database: '',
    options: {
        encrypt: true,
        trustServerCertificate: true,
        enableArithAbort: true,
        connectTimeout: 30000,
        requestTimeout: 30000,
    },
    port: 5000,
};

// const dbConfigWallet = {
//     user: 'sa',
//     password: 'System@123',
//     server: '10.123.10.106',
//     database: 'Wallet',
//     options: {
//         encrypt: true,
//         trustServerCertificate: true,
//         enableArithAbort: true,
//         connectTimeout: 50000,
//         requestTimeout: 50000,
//     },  
//     port: 1433,
// };

module.exports = dbConfigWallet;