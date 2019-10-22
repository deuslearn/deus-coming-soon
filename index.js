const path = require('path')
const express = require('express')
const app = express()

const PORT = 8899

app.set('view engine', 'pug')
app.locals.basedir = app.get('views');

app.use("/public", express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index');
});

const server = app.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT}`)
})