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

function validar_id(id) {
    id = Number(id); 
    if (isNaN(id) || !Number.isInteger(id)) { 
        return false;
    }
    return true;
}

app.get('/api/v1/usuarios/:id', (req, res) => {
    if(!validar_id(req.params.id)){
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

    if(nuevo.nombre === undefined || nuevo.contraseña === undefined || !validar_mail(nuevo.mail) || nuevo.balance < 0){
        res.sendStatus(400)
        return
    }
    usuarios.push(nuevo)
    res.sendStatus(201)
})

app.delete('/api/v1/usuarios/:id', (req, res) => {
    if(!validar_id(req.params.id)){
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
    let editar_indice = usuarios.findIndex((element) => element.id == req.params.id)
    if(editar_indice === -1){
        res.sendStatus(404)
        return
    }
    usuarios[editar_indice].nombre = req.body.nombre ?? usuarios[editar_indice].nombre
    usuarios[editar_indice].balance = req.body.balance ?? usuarios[editar_indice].balance
    usuarios[editar_indice].mail = req.body.mail ?? usuarios[editar_indice].mail
    usuarios[editar_indice].contraseña = req.body.contraseña ?? usuarios[editar_indice].contraseña

    if(!validar_mail(usuarios[editar_indice].mail) || ususarios[editar_indice].balance < 0){ 
        res.sendStatus(400)
        return
    }

    res.send(usuarios[editar_indice]).status(200)
})


app.get('/api/v1/skins', (req, res) =>{
    res.json(skins)
})

app.get('/api/v1/skins/:id' , (req, res) => {
    if(!validar_id(req.params.id)){
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
        precio_mercado: req.body.precio_mercado ?? 2,
        imagen_url: req.body.imagen_url
    }

    if(nuevo.nombre === undefined || nuevo.tipo === undefined || nuevo.rareza === undefined || nuevo.imagen_url === undefined){
        res.sendStatus(400)
        return;
    }

    skins.push(nuevo)
    res.sendStatus(201)

})


app.delete('/api/v1/skins/:id', (req, res) => {
    if(!validar_id(req.params.id)){
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
    
    if(nuevo.nombre === undefined || nuevo.tipo === undefined || nuevo.rareza === undefined || nuevo.imagen_url === undefined || 0 < nuevo.precio_mercado > 5){
        res.sendStatus(400)
        return;
    }

    res.send(skins[editar_indice]).status(200)
})


app.get('/api/v1/cajas/', (req, res)=>{
    res.json(cajas)
})


app.get('/api/v1/cajas/:id' , (req, res) => {
    if(!validar_id(req.params.id)){
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})