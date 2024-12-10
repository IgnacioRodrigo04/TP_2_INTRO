const express = require('express')
const app = express()
const port = 3000

app.use(express.json())

let usuarios = [{
    id: 1,
    nombre: "nacho",
    plata: 100,
    coleccion: []    
}]

app.get('/', (req, res) => {
  res.send('Skins CS')
})

app.get('/api/v1/usuarios', (req, res) => {    
    res.json(usuarios)
})

app.get('/api/v1/usuarios/:id', (req, res) => {
    if (typeof req.params.id !== "number") {
        res.sendStatus(400)
        return
    }  
    const usuario = usuarios.find((element) => element.id == req.params.id)
    if(usuario === undefined){
        res.sendStatus(404)
        return
    }
    res.json(usuario)   
})

app.post('/api/v1/usuarios', (req, res) => {
    const nuevo = {
        id: usuarios.length+1,
        nombre: req.body.nombre,
        plata: req.body.plata ?? 0,
        coleccion: []
    }

    if(nuevo.nombre === undefined){
        res.sendStatus(400)
        return
    }
    usuarios.push(nuevo)
    res.sendStatus(201)
})

app.delete('/api/v1/usuarios/:id', (req, res) => {
    if (typeof req.params.id !== "number") {
        res.sendStatus(400)
        return
    }
    
    const eliminar = usuarios.find((element) => element.id == req.params.id)
    if(eliminar === undefined){
        res.sendStatus(404)
        return
    }

    usuarios = usuarios.filter((element) => element.id != req.params.id)
    res.send(eliminar).status(200)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})