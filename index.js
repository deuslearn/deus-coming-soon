const path = require('path')
const express = require('express')
const app = express()

const PORT = process.env.PORT || 8080;

app.set('view engine', 'pug')
app.set('env production');

app.locals.basedir = app.get('views');

app.use("/public", express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(PORT)