
import express from 'express';
import { PrismaClient } from '@prisma/client';

import cors from 'cors';

const prisma = new PrismaClient();

export default prisma;

const DATABASE_URL = env("DATABASE_URL")

const app = express();
const puerto = 3000
app.use(cors()); 

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
        res.sendStatus(400);
        return;
    }
    const usuario = await prisma.usuario.findUnique({
        where: { id: parseInt(req.params.id) },
        include: { skins: true, historial: true}
    });

    if(usuario === null){
        res.sendStatus(404)
        return;
    }
    res.json(usuario);
});


app.post('/api/v1/usuarios', async (req, res) => {
    const nuevo = {
        nombre: req.body.nombre,
        plata: req.body.plata,
        rango: req.body.rango,
    }
    if(nuevo.nombre === undefined || nuevo.rango === undefined ||  !validar_numero(nuevo.plata) || nuevo.plata < 0 || validar_numero(nuevo.nombre)|| validar_numero(nuevo.rango)){
        res.sendStatus(400)
        return
    }

    const nuevo_usuario = await prisma.usuario.create({
        data: {
            nombre: req.body.nombre,
            plata:  req.body.plata,
            rango: req.body.rango,
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

    let usuario = await prisma.usuario.findUnique({
        where: {
            id: parseInt(req.params.id)
        }
    })

    if (usuario === null){
        res.sendStatus(404)
        return
    }
    const { nombre, plata, rango, skins, historial } = req.body;

    const historialId = historial
    if (historialId) {
        await prisma.historial.update({
          where: { id: historialId },
          data: { usuarioId: usuario.id }  
        });
      }
    usuario = await prisma.usuario.update({
        where: {
            id: usuario.id
        },
        data:{
            nombre: nombre,
            plata: plata,
            rango: rango,
            skins: { 
                set: skins ? skins.map(id => ({ id })) : undefined
            }
    },
    include: { skins: true, historial: true }
        
    });

    res.send(usuario);
})

app.get('/api/v1/usuarios/:id/skins', async (req, res) =>{
    if(!validar_numero(req.params.id)){
        res.sendStatus(400);
        return;
    }
    const usuario = await prisma.usuario.findUnique({
        where: { id: parseInt(req.params.id) },
        include: {skins: true}
    });

    if(usuario === null){
        res.sendStatus(404)
        return;
    }

    res.send(usuario.skins);
})

app.get('/api/v1/usuarios/:id/historial', async (req, res) =>{
    if(!validar_numero(req.params.id)){
        res.sendStatus(400);
        return;
    }
    const usuario = await prisma.usuario.findUnique({
        where: { id: parseInt(req.params.id) },
        include: {historial: true}
    });

    if(usuario === null){
        res.sendStatus(404)
        return;
    }

    res.send(usuario.historial);
})

app.put('/api/v1/usuarios/:id/skins', async (req, res) => {
    if (!validar_numero(req.params.id)) {
        return res.sendStatus(400);
    }

    const usuario = await prisma.usuario.findUnique({
        where: { id: parseInt(req.params.id) },
        include: { skins: true } 
    });

    if (!usuario) {
        return res.status(404).send("Usuario no encontrado");
    }

    const skin = await prisma.skins.findUnique({
        where: { id: parseInt(req.body.id_skin) }
    });

    if (!skin) {
        return res.status(404).send("Skin no encontrada");
    }

    const usuario_actualizado = await prisma.usuario.update({
        where: { id: usuario.id },
        data: {
            skins: {
                connect: { id: skin.id } 
            }
        },
        include: { skins: true }
    });

    res.send(usuario_actualizado);
});

app.put('/api/v1/usuarios/:id/historial', async (req, res) => {
    if (!validar_numero(req.params.id)) {
        return res.sendStatus(400);
    }

    const usuario = await prisma.usuario.findUnique({
        where: { id: parseInt(req.params.id) },
        include: { historial: true } 
    });

    if (!usuario) {
        return res.status(404).send("Usuario no encontrado");
    }

    const historial = await prisma.historial.findUnique({
        where: { id: parseInt(req.body.id_historial) }
    });

    if (!historial) {
        return res.status(404).send("Historial no encontrado");
    }

    const usuario_actualizado = await prisma.usuario.update({
        where: { id: usuario.id },
        data: {
            historial: {
                connect: { id: historial.id } 
            }
        },
        include: { historial: true }
    });

    res.send(usuario_actualizado);
});

app.get('/api/v1/skins', async (req, res) =>{
    const skins = await prisma.skins.findMany()  
    res.json(skins)
})

app.get('/api/v1/skins/:id' , async (req, res) => {
    if(!validar_numero(req.params.id)){
        res.sendStatus(400)
        return;
    }
    const skin = await prisma.skins.findUnique({
        where: {
            id: parseInt(req.params.id)
        }
    })
    if(skin === null){
        res.sendStatus(404)
        return   
    }
    res.json(skin) 
})

app.post('/api/v1/skins', async (req, res) =>{
    const nuevo = {
        nombre: req.body.nombre,
        precio: req.body.precio,
        tipo: req.body.tipo,
        rareza: req.body.rareza,
        imagen: req.body.imagen
    }

    if(nuevo.nombre === undefined || nuevo.tipo === undefined || nuevo.rareza === undefined || nuevo.imagen === undefined || !validar_numero(nuevo.precio) || 
    nuevo.precio <= 0 || validar_numero(nuevo.rareza) || validar_numero(nuevo.tipo)){
        res.sendStatus(400)
        return;
    }
   
    const nueva_skin = await prisma.skins.create({
        data: {
            nombre: req.body.nombre,
            precio: req.body.precio,
            tipo: req.body.tipo,
            rareza: req.body.rareza,
            imagen: req.body.imagen
        }
    }) 
    res.status(201).send(nueva_skin)

})

app.delete('/api/v1/skins/:id', async (req, res) => {
    if(!validar_numero(req.params.id)){
        res.sendStatus(400)
        return;
    }
    const skin = await prisma.skins.findUnique({
        where: {
            id: parseInt(req.params.id)
        }
    })
    if(skin === null){
        res.sendStatus(404)
        return   
    }
    await prisma.skins.delete({
        where:{
            id: parseInt(req.params.id)
        }
    })
   res.send(skin)
})

app.put('/api/v1/skins/:id' , async (req, res) =>{
    
    if(!validar_numero(req.params.id)){
        res.sendStatus(400)
        return;
    }

    let skin = await prisma.skins.findUnique({
        where: {
            id: parseInt(req.params.id)
        }
    })

    if (skin === null){
        res.sendStatus(404)
        return
    }
    
    skin = await prisma.skins.update({
        where: {
            id: skin.id
        },
        data:{
            nombre: req.body.nombre,
            precio: req.body.precio,
            tipo: req.body.tipo,
            rareza: req.body.rareza,
            imagen: req.body.imagen
        }
    })

    res.send(skin);
})


app.get('/api/v1/historial', async (req, res) =>{
    const historial = await prisma.historial.findMany()  
    res.json(historial)
})

app.get('/api/v1/historial/:id' , async (req, res) => {
    if(!validar_numero(req.params.id)){
        res.sendStatus(400)
        return;
    }
    const historial = await prisma.historial.findUnique({
        where: {
            id: parseInt(req.params.id)
        }
    })
    if(historial === null){
        res.sendStatus(404)
        return   
    }
    res.json(historial) 
})

app.post('/api/v1/historial', async (req, res) =>{
    const nuevo = {
        kda: req.body.kda,
        partidas_totales: req.body.partidas_totales,
        partidas_ganadas: req.body.partidas_ganadas,
        partidas_perdidas: req.body.partidas_perdidas,
        winrate: req.body.winrate
    }

    if(nuevo.kda === undefined || nuevo.partidas_ganadas === undefined || nuevo.partidas_perdidas === undefined || nuevo.winrate === undefined || !validar_numero(nuevo.partidas_totales) || 
    nuevo.partidas_totales < 0 || !validar_numero(nuevo.partidas_perdidas) || !validar_numero(nuevo.partidas_ganadas)){
        res.sendStatus(400)
        return;
    }
   
    const nuevo_historial = await prisma.historial.create({
        data: {
            kda: req.body.kda,
            partidas_totales: req.body.partidas_totales,
            partidas_ganadas: req.body.partidas_ganadas,
            partidas_perdidas: req.body.partidas_perdidas,
            winrate: req.body.winrate
        }
    }) 
    res.status(201).send(nuevo_historial)

})

app.delete('/api/v1/historial/:id', async (req, res) => {
    if(!validar_numero(req.params.id)){
        res.sendStatus(400)
        return;
    }
    const borrar = await prisma.historial.findUnique({
        where: {
            id: parseInt(req.params.id)
        }
    })
    if(borrar === null){
        res.sendStatus(404)
        return   
    }
    await prisma.historial.delete({
        where:{
            id: parseInt(req.params.id)
        }
    })
   res.send(borrar)
})


app.put('/api/v1/historial/:id' , async (req, res) =>{
    
    if(!validar_numero(req.params.id)){
        res.sendStatus(400)
        return;
    }

    let editar = await prisma.historial.findUnique({
        where: {
            id: parseInt(req.params.id)
        }
    })

    if (editar === null){
        res.sendStatus(404)
        return
    }
    
    editar = await prisma.historial.update({
        where: {
            id: editar.id
        },
        data:{
            kda: req.body.kda,
            partidas_totales: req.body.partidas_totales,
            partidas_ganadas: req.body.partidas_ganadas,
            partidas_perdidas: req.body.partidas_perdidas,
            winrate: req.body.winrate
        }
    })

    res.send(editar);
})