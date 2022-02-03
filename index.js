const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'pmss951623',
    database: 'game'
})

app.use('/public', express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({extended: false}));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('main');
})
//점수와 유저를 판단한다.
app.post('/makerank', (req, res) => {
    res.render('makerank', {score: req.body.score});
})


//db에 정보 저장 랭크 페이지로 이동
app.post('/rank', (req, res) => {
    var id = req.body.id;
    var pw = req.body.pw;
    var score = req.body.score;
    var ms = req.body.cm;
    var sql = "select * from user where id = ?"
    conn.query(sql, [id], (err, rows, field) => {
        if(rows[0] == null){
            var sql = `insert into user(id, password, best, low) values("${id}", "${pw}", ${score}, ${score})`
            conn.query(sql, (err, rows, field) => {
            })
            var sql = `insert into rank values ("${id}", ${score}, "${ms}")`
            conn.query(sql, (err, rows, field)=>{
            })

        }else if(rows[0].password === pw){
            if(rows[0].best < score){
                var sql = `update user set best = ${score} where id = ?`;
                conn.query(sql, [id], (err, rows, field) => {
                })
            }
            if(rows[0].low > score){
                var sql = `update user set low = ${score} where id = ?`;
                conn.query(sql, [id], (err, rows, field) => {      
                })
            }
            var sql = `insert into rank values ("${id}", ${score}, "${ms}")`
            conn.query(sql, (err, rows, field)=>{
            })
        }else if(rows[0].password !== pw){
            res.redirect(307,'makerank');
        }
        res.render('main');
    })
})

app.get('/rank', (req, res) => {
    var sql = 'select * from rank order by score desc';
        conn.query(sql, (err, rows, field) => {
            res.render('rank', {rows: rows});
        })
})

app.get('/game', (req, res) => {
    res.render('game');
})

app.get('/user/:id', (req, res) => {
    var id = req.params.id
    var sql = 'select id, best, low from user where id = ?'
    conn.query(sql, [id], (err, rows, field) => {
        res.send(`id:${rows[0].id}, 최고점수:${rows[0].best}, 최하점수:${rows[0].low}`);
    })
})

app.listen(8080, (req, res) => {
    console.log("8080 Port connected");
})