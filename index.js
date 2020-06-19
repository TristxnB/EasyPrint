var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var fs = require('fs');
var path = require("path");
var optionsFolder = path.join(__dirname, "options")
var optionsFile = path.join(optionsFolder, "options.json")

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.use(express.static(__dirname));

app.get('/', function(req, res) {
    if(!fs.existsSync(optionsFolder)){
        console.log("EasyPrint isn't installed.")
        res.redirect('/install')
    }else{
        res.render("index", {
            nickname: JSON.parse(fs.readFileSync(optionsFile)).nickname,
            printer: JSON.parse(fs.readFileSync(optionsFile)).printer
        })
    }
})

app.get('/install', function(req, res) {
    if(!fs.existsSync(optionsFolder)){
        res.render('install')
    }else{
        res.redirect('/')
    }
})

app.post('/install', function(req, res) {
    if(!fs.existsSync(optionsFolder)){
        fs.mkdirSync(optionsFolder)
        fs.writeFileSync(optionsFile, JSON.stringify({
            "nickname": req.body.nickname,
            "printer": req.body.printer
        }))
        res.redirect('/')
    } else {
        res.render('error', {
            err: "EasyPrint semble déjà être installé 🤔 Essayes de supprimer le dossier 'options'..."
        })
    }
})

app.listen(2301, function(){
    console.log("Ok!")
});