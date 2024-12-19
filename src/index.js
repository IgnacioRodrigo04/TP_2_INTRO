
import { getConnection } from './database.js'
import sql from 'mssql'

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';

const app = express();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});

app.use(express.json())


app.get('/', (req, res) => {
  res.send('Skins CS')
})

app.get('/api/v1/usuarios',  async (req, res) => {    
    const conexion = await getConnection()
    const resultado = await conexion.request().query("SELECT * FROM Usuarios")
    res.json(resultado.recordset)
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
    const conexion = await getConnection()
    const resultado = await conexion.request()
    .input('id', sql.Int, req.params.id)
    .query("SElECT * FROM Usuarios WHERE id = @id")
    
    if(resultado.recordset.length === 0){
        res.sendStatus(404)
        return
    }
    res.status(200).json(resultado.recordset[0])   
})

function validar_mail(mail) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(mail);
}

app.post('/api/v1/usuarios', async (req, res) => {
    const nuevo = {
        nombre: req.body.nombre,
        balance: req.body.balance ?? 0,
        mail: req.body.mail,
        contraseña: req.body.contraseña,
        skins_compradas: []
    }
    if(nuevo.nombre === undefined || nuevo.contraseña === undefined || !validar_mail(nuevo.mail) || !validar_numero(nuevo.balance) || nuevo.balance < 0 || validar_numero(nuevo.nombre)
    ||  !Array.isArray(nuevo.skins_compradas) || !nuevo.skins_compradas.every(validar_numero)){
        res.sendStatus(400)
        return
    }

    const conexion =  await getConnection()
    const resultado = await conexion.request()
        .input('nombre', sql.VarChar, nuevo.nombre)
        .input('balance', sql.Int, nuevo.balance)
        .input('mail', sql.VarChar, nuevo.mail)
        .input('contraseña', sql.VarChar, nuevo.contraseña)
        .input('skins_compradas', sql.VarChar, nuevo.skins_compradas.join(','))
        .query(' INSERT INTO usuarios (nombre, balance, mail, contraseña, skins_compradas)(@nombre, @balance, @mail, @contraseña, @skins_compradas)');
    res.sendStatus(201)
})

app.delete('/api/v1/usuarios/:id', async (req, res) => {
    if(!validar_numero(req.params.id)){
        res.sendStatus(400)
        return;
    }
    const conexion = await getConnection()
    const usuario = await conexion.request()
    .input("id", sql.Int, req.params.id)
    .query("SELECT * FROM Usuarios WHERE id = @id");

    if(usuario.recordset.length === 0){
        res.sendStatus(404)
        return
    }
    await conexion.request()
    .input("id", sql.Int, req.params.id)
    .query("DELETE FROM Usuarios WHERE id = @id");

    res.status(200).send(usuario.recordset[0])
})


app.put('/api/v1/usuarios/:id' , async (req, res) =>{
    if(!validar_numero(req.params.id)){
        res.sendStatus(400)
        return;
    }
    const  { nombre, balance, mail, contraseña, skins_compradas } = req.body;
    if(!validar_mail(mail) || balance < 0 || !validar_numero(balance) || validar_numero(contraseña) 
        || nombre === undefined || contraseña === undefined || !Array.isArray(skins_compradas) || !skins_compradas.every(validar_numero)){ 
        res.sendStatus(400)
        return;
    }
    
    const conexion = await getConnection()
    const editado = await conexion.request()
    .input("id", sql.Int, req.params.id)
    .input("nombre", sql.VarChar, req.body.nombre)
    .input("balance", sql.Int, req.body.balance)
    .input("mail", sql.VarChar, req.body.mail)
    .input("contraseña", sql.VarChar, req.body.contraseña)
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


app.get('/api/v1/cajas/', async (req, res)=>{
    const conexion = await getConnection()
    const resultado = await conexion.request().query("SELECT * FROM Caja")
    res.json(resultado.recordset)
})


app.get('/api/v1/cajas/:id' , async (req, res) => {
    if(!validar_numero(req.params.id)){
        res.sendStatus(400)
        return;
    }
    const conexion = await getConnection()
    const resultado = await conexion.request()
    .input('id', sql.Int, req.params.id)
    .query("SElECT * FROM Caja WHERE id = @id")
    
    if(resultado.recordset.length === 0){
        res.sendStatus(404)
        return
    }
    res.status(200).json(resultado.recordset[0])  
})

app.post('/api/v1/cajas', async (req, res) =>{
    const nuevo = {
        nombre: req.body.nombre,
        precio: req.body.precio ?? 1,
        tipo: req.body.tipo,
        imagen_url: req.body.imagen_url,
        posibles_skins: req.body.posibles_skins

    }
    if(nuevo.nombre === undefined || nuevo.tipo === undefined || nuevo.precio === undefined || nuevo.imagen_url === undefined || !Array.isArray(nuevo.posibles_skins) || 
    nuevo.posibles_skins.length === 0 ||!validar_numero(nuevo.precio) || nuevo.precio <= 0){
        res.sendStatus(400)
        return;
    }
   
    const conexion =  await getConnection()
    const resultado = await conexion.request()
        .input('nombre', sql.VarChar, nuevo.nombre)
        .input('precio', sql.Int, nuevo.precio)
        .input('tipo', sql.VarChar, nuevo.tipo)
        .input('imagen_url', sql.Varchar, nuevo.imagen_url)
        .input('posibles_skins', sql.VarChar, nuevo.posibles_skins.join(','))
        .query('INSERT INTO Caja (nombre, precio, tipo, imagen_url, posibles_skins)(@nombre, @precio, @tipo, @imagen_url, @posibles_skins)');
    
    res.sendStatus(201)

})

app.delete('/api/v1/cajas/:id', async (req, res) => {
    if(!validar_numero(req.params.id)){
        res.sendStatus(400)
        return;
    }
    const conexion = await getConnection()
    const caja = await conexion.request()
    .input("id", sql.Int, req.params.id)
    .query("SELECT * FROM Caja WHERE id = @id");

    if(caja.recordset.length === 0){
        res.sendStatus(404)
        return
    }
    await conexion.request()
    .input("id", sql.Int, req.params.id)
    .query("DELETE FROM Caja WHERE id = @id");

    res.status(200).send(caja.recordset[0])
})

app.put('/api/v1/cajas/:id' , async (req, res) =>{

    if(!validar_numero(req.params.id)){
        res.sendStatus(400)
        return;
    }
    const  { nombre, tipo,  precio, imagen_url, posibles_skins} = req.body;
    if(validar_numero(nombre) || precio < 0 || !validar_numero(precio) || validar_numero(imagen_url) 
        || nombre === undefined || tipo === undefined ||imagen_url === undefined|| validar_numero(tipo) || !Array.isArray(posibles_skins) || posibles_skins.length === 0){ 
        res.sendStatus(400)
        return;
    }
    
    const conexion = await getConnection()
    const editado = await conexion.request()
    .input("id", sql.Int, req.params.id)
    .input("nombre", sql.VarChar, req.body.nombre)
    .input("tipo", sql.VarChar, req.body.tipo)
    .input("precio", sql.Int, req.body.precio)
    .input("imagen_url", sql.VarChar, req.body.imagen_url)
    .input('posibles_skins', sql.VarChar, req.body.posibles_skins.join(','))

    .query('UPDATE Skin SET nombre = @nombre, tipo = @tipo, precio = @precio, imagen_url = @imagen_url, posibles_skins = @posibles_skins WHERE id = @id')
   
    if(editado.rowsAffected[0] === 0){
        res.sendStatus(404)
        return
    }

    const caja_actualizada = await conexion.request()
    .input("id", sql.Int, req.params.id)
    .query("SELECT * FROM Caja WHERE id = @id");

    res.status(200).send(caja_actualizada.recordset[0]);
})
