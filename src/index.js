
import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;

const app = express();
const puerto = 3000

app.listen(puerto, () => {
  console.log(`Servidor corriendo en el puerto ${puerto}`);
})

app.use(express.json())


app.get('/', (req, res) => {
  res.send('Skins CS')
})

app.get('/api/v1/usuarios',  async (req, res) => { 
    const usuarios = await prisma.usuario.findMany()  
    res.json(usuarios)
})

function validar_numero(numero) {
    numero = Number(numero); 
    if (isNaN(numero) || !Number.isInteger(numero)) { 
        return false;
    }
    return true;
}

app.get('/api/v1/usuarios/:id', async (req, res) => {
    if(!validar_numero(req.params.id)){
        res.sendStatus(400)
        return;
    }
    const usuario = await prisma.usuario.findUnique({
        where: {
            id: parseInt(req.params.id)
        }
    })
    if(usuario === null){
        res.sendStatus(404)
        return   
    }
    res.json(usuario)
})


app.post('/api/v1/usuarios', async (req, res) => {
    const nuevo = {
        nombre: req.body.nombre,
        plata: req.body.plata,
        rango: req.body.rango,
        historial: req.body.historial,
        coleccion: req.body.coleccion
    }
    if(nuevo.nombre === undefined || nuevo.rango === undefined ||  !validar_numero(nuevo.plata) || nuevo.plata < 0 || validar_numero(nuevo.nombre)
    ||  !Array.isArray(nuevo.coleccion) || !nuevo.coleccion.every(validar_numero)){
        res.sendStatus(400)
        return
    }

    const nuevo_usuario = await prisma.usuario.create({
        data: {
            nombre: req.body.nombre,
            plata:  req.body.plata,
            rango: req.body.rango,
            coleccion: req.body.coleccion,
            historial: req.body.historial
        }
    }) 
    res.status(201).send(nuevo_usuario)
})


app.delete('/api/v1/usuarios/:id', async (req, res) => {
    if(!validar_numero(req.params.id)){
        res.sendStatus(400)
        return;
    }

    const usuario = await prisma.usuario.findUnique({
        where: {
            id: parseInt(req.params.id)
        }
    })
    
    if(usuario === null){
        res.sendStatus(404)
        return   
    }

    await prisma.usuario.delete({
        where:{
            id: parseInt(req.params.id)
        }
    })

   res.send(usuario)
})


app.put('/api/v1/usuarios/:id' , async (req, res) =>{
    if(!validar_numero(req.params.id)){
        res.sendStatus(400)
        return;
    }
    const  { nombre, plata, rango, historial, skins_compradas } = req.body;
    if( plata < 0 || !validar_numero(plata) || rango === undefined 
        || nombre === undefined || historial === undefined || !Array.isArray(skins_compradas) || !skins_compradas.every(validar_numero)){ 
        res.sendStatus(400)
        return;
    }
    
    const conexion = await getConnection()
    const editado = await conexion.request()
    .input("id", sql.Int, req.params.id)
    .input("nombre", sql.VarChar, req.body.nombre)
    .input("plata", sql.Int, req.body.plata)
    .input("rango", sql.VarChar, req.body.rango)
    .input("historial", sql.VarChar, req.body.historial)
    .input('skins_compradas', sql.VarChar, req.body.skins_compradas.join(','))

    .query('UPDATE usuarios SET nombre = @nombre, balance = @balance, mail = @mail, contraseña = @contraseña, skins_compradas = @skins_compradas WHERE id = @id')
   
    if(editado.rowsAffected[0] === 0){
        res.sendStatus(404)
        return
    }

    const usuario_actualizado = await conexion.request()
    .input("id", sql.Int, req.params.id)
    .query("SELECT * FROM Usuarios WHERE id = @id");

    res.status(200).send(usuario_actualizado.recordset[0]);
})


app.get('/api/v1/skins', async (req, res) =>{
    const conexion = await getConnection()
    const resultado = await conexion.request().query("SELECT * FROM Skin")
    res.json(resultado.recordset)
})

app.get('/api/v1/skins/:id' , async (req, res) => {
    if(!validar_numero(req.params.id)){
        res.sendStatus(400)
        return;
    }
    const conexion = await getConnection()
    const resultado = await conexion.request()
    .input('id', sql.Int, req.params.id)
    .query("SElECT * FROM Skin WHERE id = @id")
    
    if(resultado.recordset.length === 0){
        res.sendStatus(404)
        return
    }
    res.status(200).json(resultado.recordset[0])  
})

app.post('/api/v1/skins', async (req, res) =>{
    const nuevo = {
        nombre: req.body.nombre,
        rareza: req.body.rareza,
        tipo: req.body.tipo,
        precio_mercado: req.body.precio_mercado ?? 100,
        imagen_url: req.body.imagen_url
    }

    if(nuevo.nombre === undefined || nuevo.tipo === undefined || nuevo.rareza === undefined || nuevo.imagen_url === undefined || !validar_numero(nuevo.precio_mercado) || 
    nuevo.precio_mercado <= 0 || validar_numero(nuevo.rareza) || validar_numero(nuevo.tipo)){
        res.sendStatus(400)
        return;
    }
   
    const conexion =  await getConnection()
    const resultado = await conexion.request()
        .input('nombre', sql.VarChar, nuevo.nombre)
        .input('rareza', sql.VarChar, nuevo.rareza)
        .input('tipo', sql.VarChar, nuevo.tipo)
        .input('precio_mercado', sql.Int, nuevo.precio_mercado)
        .input('imagen_url', sql.VarChar, nuevo.imagen_url)
        .query('INSERT INTO Skin (nombre, rareza, tipo, precio_mercado, imagen_url)(@nombre, @rareza, @tipo, @precio_mercado, @imagen_url)');
    res.sendStatus(201)

})


app.delete('/api/v1/skins/:id', async (req, res) => {
    if(!validar_numero(req.params.id)){
        res.sendStatus(400)
        return;
    }
    const conexion = await getConnection()
    const skin = await conexion.request()
    .input("id", sql.Int, req.params.id)
    .query("SELECT * FROM Skin WHERE id = @id");

    if(skin.recordset.length === 0){
        res.sendStatus(404)
        return
    }
    await conexion.request()
    .input("id", sql.Int, req.params.id)
    .query("DELETE FROM Skin WHERE id = @id");

    res.status(200).send(skin.recordset[0])
})

app.put('/api/v1/skins/:id' , async (req, res) =>{
    
    if(!validar_numero(req.params.id)){
        res.sendStatus(400)
        return;
    }
    const  { nombre, tipo, rareza, precio_mercado, imagen_url } = req.body;
    if(validar_numero(nombre) || precio_mercado < 0 || !validar_numero(precio_mercado) || validar_numero(imagen_url) 
        || nombre === undefined || tipo === undefined || rareza === undefined|| validar_numero(tipo) || validar_numero(rareza)){ 
        res.sendStatus(400)
        return;
    }
    
    const conexion = await getConnection()
    const editado = await conexion.request()
    .input("id", sql.Int, req.params.id)
    .input("nombre", sql.VarChar, req.body.nombre)
    .input("tipo", sql.Varchar, req.body.tipo)
    .input("rareza", sql.VarChar, req.body.rareza)
    .input("precio_mercado", sql.Int, req.body.precio_mercado)
    .input('imagen_url', sql.VarChar, req.body.imagen_url)

    .query('UPDATE Skin SET nombre = @nombre, tipo = @tipo, rareza = @rareza, precio_mercado = @precio_mercado, imagen_url = @imagen_url WHERE id = @id')
   
    if(editado.rowsAffected[0] === 0){
        res.sendStatus(404)
        return
    }

    const skin_actualizada = await conexion.request()
    .input("id", sql.Int, req.params.id)
    .query("SELECT * FROM Skin WHERE id = @id");

    res.status(200).send(skin_actualizada.recordset[0]);
})

