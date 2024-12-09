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
    const usuario = usuarios.find((element) => element.id == req.params.id)
    if(usuario === undefined){
        res.sendStatus(404)
        return
    }
    res.json(usuario)   
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})