const express = require('express')
const app = express()
const port = 3000

app.use(express.json())

let usuarios = [{
    id: 1,
    nombre: "nacho",
    balance: 100,
    mail: "hola@gmail.com",
    contraseña: "sdkiedk1",
    skins_compradas: []    
}]

let skins = [{
    id: 1,
    nombre: "fuego epico",
    rareza: "super epica",
    tipo: "awp",
    precio_mercado: 0,
    imagen: undefined   
},{
    id: 2,
    nombre: "sombra asesina",
    rareza: "ultra epica",
    tipo: "awp",
    precio_mercado: 4,
    imagen: undefined   
}]

let cajas = [{
    id: 1, 
    nombre: "caja lolera",
    precio: 10,
    tipo: "epica",
    imagen_url: undefined,
    posibles_skins: []

}]

app.get('/', (req, res) => {
  res.send('Skins CS')
})

app.get('/api/v1/usuarios', (req, res) => {    
    res.json(usuarios)
})

function validar_numero(numero) {
    numero = Number(numero); 
    if (isNaN(numero) || !Number.isInteger(numero)) { 
        return false;
    }
    return true;
}

app.get('/api/v1/usuarios/:id', (req, res) => {
    if(!validar_numero(req.params.id)){
        res.sendStatus(400)
        return;
    }
    const usuario = usuarios.find((element) => element.id == req.params.id)
    if(usuario === undefined){
        res.sendStatus(404)
        return
    }
    res.json(usuario)   
})

function validar_mail(mail) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(mail);
}

app.post('/api/v1/usuarios', (req, res) => {
    const nuevo = {
        id: usuarios.length+1,
        nombre: req.body.nombre,
        balance: req.body.balance ?? 0,
        mail: req.body.mail,
        contraseña: req.body.contraseña,
        skins_compradas: []
    }

    if(nuevo.nombre === undefined || nuevo.contraseña === undefined || !validar_mail(nuevo.mail) || !validar_numero(nuevo.balance) || nuevo.balance < 0 || validar_numero(nuevo.nombre)){
        res.sendStatus(400)
        return
    }
    usuarios.push(nuevo)
    res.sendStatus(201)
})

app.delete('/api/v1/usuarios/:id', (req, res) => {
    if(!validar_numero(req.params.id)){
        res.sendStatus(400)
        return;
    }
    const eliminar = usuarios.find((element) => element.id == req.params.id)
    if(eliminar === undefined){
        res.sendStatus(404)
        return
    }

    usuarios = usuarios.filter((element) => element.id != req.params.id)
    res.send(eliminar).status(200)
})



app.put('/api/v1/usuarios/:id' , (req, res) =>{
    if(!validar_numero(req.params.id)){
        res.sendStatus(400)
        return;
    }
    let editar_indice = usuarios.findIndex((element) => element.id == req.params.id)
    if(editar_indice === -1){
        res.sendStatus(404)
        return
    }
    usuarios[editar_indice].nombre = req.body.nombre ?? usuarios[editar_indice].nombre
    usuarios[editar_indice].balance = req.body.balance ?? usuarios[editar_indice].balance
    usuarios[editar_indice].mail = req.body.mail ?? usuarios[editar_indice].mail
    usuarios[editar_indice].contraseña = req.body.contraseña ?? usuarios[editar_indice].contraseña
    usuarios[editar_indice].skins_compradas = req.body.skins_compradas ?? usuarios[editar_indice].skins_compradas

    if(!validar_mail(usuarios[editar_indice].mail) || usuarios[editar_indice].balance < 0 || !validar_numero(usuarios[editar_indice].balance) || validar_numero(usuarios[editar_indice].contraseña)){ 
        res.sendStatus(400)
        return;
    }
    
    let lista_skins = usuarios[editar_indice].skins_compradas
    for(let i=0; i < lista_skins.length; i++){
        if(!validar_numero(lista_skins[i])){
            res.sendStatus(400)
            return;
        }
    }

    res.send(usuarios[editar_indice]).status(200)
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