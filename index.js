const express = require('express')
const app = express();
const fs = require('fs');
const puerto = 8080;
const ruta = "./productos.txt";
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'));
const router = express.Router();
app.use('/api', router);
const handlebars = require('express-handlebars');
app.engine('hbs',handlebars({
    extname:'.hbs',
    defaultLayout:'index.hbs',
    layoutsDir:__dirname+'/views/layouts',
    partialsDir:__dirname+'/views/partials'
}))
app.use(express.static('public'));
let productos = []


router.get('/productos/listar', (req, res) => {

    async function read(ruta) {
        try {
            const archivo = await fs.promises.readFile(ruta);
            res.send(JSON.parse(archivo));
        } catch (err) {
            res.send("No se encontraron productos");
        }
    }
    read(ruta);

});

router.get('/productos/vista', (req, res) => {
    
    if (productos.length == 0){
        
        
        res.render('main', {productos, listExist:false})
        console.log(productos)
    }
    
    else{
    res.render('main', {productos, listExist:true})}
})

router.post('/productos', (req, res) => {
    let { name, price, thumbnail} = req.body
    let id = productos.length + 1;
    let producto = {
        id,
        name,
        price,
        thumbnail
       
    }
    
    productos.push(producto)
    let data = JSON.stringify(productos,null,2);
    fs.writeFileSync(ruta, data, 'utf-8')
    
    res.send(producto)
})

router.get('/productos/listar/:id', (req,res) =>{
    const id = req.params.id
    const producto = productos.find(producto => producto.id == id)
    if (!producto){
        res.json({'error': 'Producto no encontrado'})
    }
    res.json(producto)
})

router.delete('/productos/:id', (req,res)=>{
    const id = req.params.id
    const producto = productos.find(producto => producto.id == id)
    if(!producto){
        res.status(404).send('El producto que usted intenta eliminar ya no existe')
    }else{
    productos = productos.filter( producto => producto.id != id)
    res.status(200).send('El producto ha sido eliminado') }
    
})
router.put('/productos/:id', (req,res)=>{
    const id = req.params.id
    const producto = productos.find(producto => producto.id === id)
    if(!producto){
        res.sendStatus(404)
    }
    const {name} = req.body
    const {price} = req.body
    producto.nombre = name
    producto.precio = price
    res.sendStatus(204)
})

app.set('views','./views/partials')
app.set('view engine','hbs')

app.listen(puerto, ()=>{
    console.log(`El servidor esta escuchando en puerto ${puerto}`)
})