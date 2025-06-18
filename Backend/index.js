import express from 'express';
import pg from 'pg';
import cors from 'cors';

const app=express()
const PORT=1000
app.use(cors())
app.use(express.json())
app.listen(PORT,()=>{
    console.log('Server start')
})
const db= new pg.Client(
{
    host:'localhost',
    database:'Scribl',
    port:5432,
    password: 'sidhumoosewala',
    user:'postgres'
}
)
db.connect()
app.post('/',(req,res)=>{
const query= `SELECT password FROM credentials WHERE username = '${req.body.username.trim()}'`
const query2= `SELECT * FROM notes WHERE username = '${req.body.username.trim()}'`
db.query(query,(err,response)=>{
    if(response.rows[0].password==req.body.password){
        db.query(query2,(err,result)=>{
            res.send(result.rows)
        })
    }
})
})
app.post('/add',(req,res)=>{
const query3= `INSERT INTO credentials VALUES ('${req.body.username.trim()}','${req.body.password.trim()}')`
const query= `SELECT username FROM credentials WHERE username='${req.body.username}'`
db.query(query,(err,response)=>{
    if(response.rows.length>0){
        res.send('inserted')
    }
    else{
        db.query(query3,(err,resp)=>[
            res.send('done')
        ])
    }
})
})
app.post('/note',(req,res)=>{
    const query3= `INSERT INTO notes VALUES('${req.body.username}','${req.body.title}','${req.body.discription}')`
    db.query(query3,(err,response)=>{
        if(err){
            throw err
        }
        res.send('done')
    })
    })
app.post('/show',(req,res)=>{
    const query2= `SELECT * FROM notes WHERE username = '${req.body.username}'`
    db.query(query2,(err,response)=>{
res.send(response.rows)   
})
})
