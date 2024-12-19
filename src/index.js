const express = require('express')
const app = express()
const port = 3000

import { getConecction } from './database'
import sql from 'mssql'

app.use(express.json())

let usuarios = []

let skins = []

let cajas = []

app.get('/', (req, res) => {
  res.send('Skins CS')
})

app.get('/api/v1/usuarios',  async (req, res) => {    
    const conexion = await getConecction()
    const resultado = await conexion.request().query("SELECT * FROM usuarios")
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
    const conexion = await getConecction()
    const resultado = await conexion.request()
    .input('id', sql.Int, req.params.id)
    .query("SElECT * FROM usuarios WHERE id = @id")
    
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

    const conexion =  await getConecction()
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
    const conexion = await getConecction()
    const eliminar = await conexion.request()
    .input("id", sql.Int, req.params.id)
    .query("DELETE FROM usuarios WHERE id = @id");

     if(eliminar.rowsAffected[0] === 0){
        res.sendStatus(404)
        return
    }
    res.status(200).send(eliminar.recordset[0])
})


app.put('/api/v1/usuarios/:id' , async (req, res) =>{
    if(!validar_numero(req.params.id)){
        res.sendStatus(400)
        return;
    }
    const validar = { nombre, balance, mail, contraseña, skins_compradas } = req.body;
    if(!validar_mail(validar.mail) || validar.balance < 0 || !validar_numero(validar.balance) || validar_numero(validar.contraseña) 
        || validar.nombre === undefined || validar.contraseña === undefined || validar.skins_compradas === undefined){ 
        res.sendStatus(400)
        return;
    }
    
    let lista_skins = validar.skins_compradas
    for(let i=0; i < lista_skins.length; i++){
        if(!validar_numero(lista_skins[i])){
            res.sendStatus(400)
            return;
        }
    }

    const conexion = await getConecction()
    const editado = await conexion.request()
    .input("id", sql.Int, req.params.id)
    .input("nombre", sql.VarChar, req.body.nombre)
    .input("balance", sql.Int, req.body.balance)
    .input("mail", sql.VarChar, req.body.mail)
    .input("contraseña", sql.VarChar, req.body.contraseña)
    .input('skins_compradas', sql.VarChar, req.body.skins_compradas.join(','))

    .query('UPDATE usuario SET nombre = @nombre, balance = @balance, mail = @mail, contraseña = @contraseña, skins_compradas = @skins_compradas WHERE id = @id')
   
    if(editado.rowsAffected[0] === 0){
        res.sendStatus(404)
        return
    }

    res.status(200).send(editado.recordset[0]);
})


app.get('/api/v1/skins', (req, res) =>{
    res.json(skins)
})

app.get('/api/v1/skins/:id' , (req, res) => {
    if(!validar_numero(req.params.id)){
        res.sendStatus(400)
        return;
    }

    const skin = skins.find((element) => element.id == req.params.id)
    if(skin === undefined){
        res.sendStatus(404)
        return
    }
    res.json(skin) 
})

app.post('/api/v1/skins', (req, res) =>{
    const nuevo = {
        id: skins.length+1,
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

    skins.push(nuevo)
    res.sendStatus(201)

})


app.delete('/api/v1/skins/:id', (req, res) => {
    if(!validar_numero(req.params.id) ){
        res.sendStatus(400)
        return;
    }

    const eliminar = skins.find((element) => element.id == req.params.id)
    if(eliminar === undefined){
        res.sendStatus(404)
        return
    }

    skins = skins.filter((element) => element.id != req.params.id)
    res.send(eliminar).status(200)
})

app.put('/api/v1/skins/:id' , (req, res) =>{
    let editar_indice = skins.findIndex((element) => element.id == req.params.id)
    if(editar_indice === -1){
        res.sendStatus(404)
        return
    }
    skins[editar_indice].nombre = req.body.nombre ?? skins[editar_indice].nombre
    skins[editar_indice].tipo = req.body.tipo ?? skins[editar_indice].tipo
    skins[editar_indice].rareza = req.body.rareza ?? skins[editar_indice].rareza
    skins[editar_indice].precio_mercado = req.body.precio_mercado ?? skins[editar_indice].precio_mercado
    skins[editar_indice].imagen_url = req.body.imagen_url ?? skins[editar_indice].imagen_url

    nuevo = skins[editar_indice]
    
    if(nuevo.nombre === undefined || nuevo.tipo === undefined || nuevo.rareza === undefined || nuevo.imagen_url === undefined 
    ||!validar_numero(nuevo.precio_mercado) || nuevo.precio_mercado <= 0 || validar_numero(nuevo.rareza) || validar_numero(nuevo.tipo) || validar_numero(nuevo.imagen_url)){
        res.sendStatus(400)
        return;
    }

    res.send(skins[editar_indice]).status(200)
})


app.get('/api/v1/cajas/', (req, res)=>{
    res.json(cajas)
})


app.get('/api/v1/cajas/:id' , (req, res) => {
    if(!validar_numero(req.params.id)){
        res.sendStatus(400)
        return;
    }

    const caja = cajas.find((element) => element.id == req.params.id)
    if(caja === undefined){
        res.sendStatus(404)
        return
    }
    res.json(caja) 
})

app.post('/api/v1/cajas', (req, res) =>{
    const nuevo = {
        id: cajas.length+1,
        nombre: req.body.nombre,
        precio: req.body.precio,
        tipo: req.body.tipo,
        imagen_url: req.body.imagen_url,
        posibles_skins: req.body.posibles_skins
    }

    if(nuevo.nombre === undefined || nuevo.tipo === undefined || nuevo.precio === undefined || nuevo.imagen_url === undefined || !Array.isArray(nuevo.posibles_skins) || 
    nuevo.posibles_skins.length === 0 ||!validar_numero(nuevo.precio) || nuevo.precio <= 0){
        res.sendStatus(400)
        return;
    }

    cajas.push(nuevo)
    res.sendStatus(201)

})

app.delete('/api/v1/cajas/:id', (req, res) => {
    if(!validar_numero(req.params.id)){
        res.sendStatus(400)
        return;
    }

    const eliminar = cajas.find((element) => element.id == req.params.id)
    if(eliminar === undefined){
        res.sendStatus(404)
        return
    }

    cajas = cajas.filter((element) => element.id != req.params.id)
    res.send(eliminar).status(200)
})

app.put('/api/v1/cajas/:id' , (req, res) =>{
    let editar_indice = cajas.findIndex((element) => element.id == req.params.id)
    if(editar_indice === -1){
        res.sendStatus(404)
        return
    }
    cajas[editar_indice].nombre = req.body.nombre ?? cajas[editar_indice].nombre
    cajas[editar_indice].tipo = req.body.tipo ?? cajas[editar_indice].tipo
    cajas[editar_indice].precio = req.body.precio ?? cajas[editar_indice].precio
    cajas[editar_indice].imagen_url = req.body.imagen_url ?? cajas[editar_indice].imagen_url
    cajas[editar_indice].posibles_skins = req.body.posibles_skins ?? cajas[editar_indice].posibles_skins

    nuevo = cajas[editar_indice]
    
    if(nuevo.nombre === undefined || nuevo.tipo === undefined || nuevo.precio === undefined || nuevo.imagen_url === undefined || 
        nuevo.posibles_skins === undefined || !Array.isArray(nuevo.posibles_skins) || nuevo.posibles_skins.length === 0
        || !validar_numero(nuevo.precio) || nuevo.precio <= 0){
        res.sendStatus(400)
        return;
    }

    for(let i=0; i < nuevo.posibles_skins.length; i++){
        if(!validar_numero(nuevo.posibles_skins[i])){
            res.sendStatus(400)
            return;
        }
    }

    res.send(cajas[editar_indice]).status(200)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})