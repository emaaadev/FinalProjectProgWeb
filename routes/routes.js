const express = require('express')
const router = express.Router()
const Article = require('../models/articles')
const multer = require('multer')
const path = require('path')
const fs = require('fs')


const uploadFolder = path.join(__dirname, '../upload')

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, uploadFolder)
    },
    filename: function(req, file, cb){
        cb(null, Date.now() +  file.originalname)
    }
})

var upload = multer({
    storage: storage
}).single('image')



// get
router.get('/', async (req, res)=>{

    try{
        const articles = await Article.find({})
        res.render('index', {titulo: 'Inicio', articles: articles})

    }
    catch(error){
        res.json({message: error})
    }
})


router.get('/add', (req, res) => {
    res.render('addArticle' , {titulo: 'Agregar Articulo'})
})

// create
router.post('/add' ,upload, () => {
    const article = new Article({
        code: req.body.code,
        name: req.body.name,
        image: req.file.filename,
        description: req.body.description,
        stock: req.body.stock,
        price: req.body.price,
    })
    article.save().then(()=>{
        req.session.message = {
            message: 'Articulo agregado correctamente!',
            type: 'success'
        }
        res.redirect('/')
    }).catch((error) => {
    res.json({
        message: error.message,
        type: 'danger'
    })
    })

})

// update
router.get('/edit/:id', async (req, res) => {
    const id = req.params.id

    try{
        const article = await Article.findById(id)

        if(article == null){
            res.redirect('/')
        }
        else{
            res.render('editArticle',{
                titulo: 'Editar Articulo',
                article: article
            })
        }
    }
    catch(error){
        res.status(500).send()
    }

})


router.post('/update:id', upload, async (req, res) =>{
    const id = req.params.id
    let new_image =''

    if(req.file){
        new_image = req.file.filename

        try{
            fs.unlinkSync('./upload/' + req.body.old_image)
        }catch(error){
            res.json({
        message: error.message,
        type: 'danger'
    })
        }
        
    }
    else{
        new_image = req.body.old_image
    }

    try{
        await Article.findByIdAndUpdate(id,{

        code: req.body.code,
        name: req.body.name,
        image: new_image,
        description: req.body.description,
        stock: req.body.stock,
        price: req.body.price,
        
        })  

        req.session.message = {
                message: 'Articulo editado exitosamente!',
                type: 'success'
        }

        res.redirect('/')

    } catch(error){
        res.json({
        message: error.message,
        type: 'danger'
    })
    }
})


// delete 
router.get('/delete/:id' ,async (req, res) => {

    const id = req.params.id

    try{
        const article = await Article.findByIdAndDelete(id)

        if(user != null && user.image != ''){
            try{
                fs.unlinkSync('./upload/' + resourceLimits.image )
            }catch(error){
                console.log(error)
            }   
        }
    
        req.session.message = {
            message: 'Usuario eliminado correctamente!',
            type: 'success'
        }
    
            res.redirect('/')

    }catch(error){
        res.json({
        message: error.message,
        type: 'danger'})
    }
})

module.exports = router