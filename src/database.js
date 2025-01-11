import sql from 'mssql'

const dbSettings = {
    user: "sa",
    password: "yourStrong(!)Password",
    server: "1433", 
    database: "MIDB", 
    options:{
        encrypt: false,
        trustServerCertifitcate: true,
    }
}

export const getConnection = async () => await sql.connect(dbSettings)