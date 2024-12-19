import sql from 'mssql'

const dbSettings = {
    user: "",
    password: "",
    server: "", 
    database: "", 
    options:{
        encrypt: false,
        trustServerCertifitcate: true,
    }
}

export const getConecction = async () => await sql.connect(dbSettings)