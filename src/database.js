import sql from 'mssql'

const dbSettings = {
    user: "sa",
    password: "yourStrong(!)Password",
    server: "localhost", 
    database: "MIDB", 
    options:{
        encrypt: false,
        trustServerCertifitcate: true,
    }
}

export const getConnection = async () => await sql.connect(dbSettings)