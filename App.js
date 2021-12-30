const express = require("express");
const mysql = require("mysql");
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

dotenv.config({path:'./.env'});

const app = express();

app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST , 
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,

});

let user = [] ;



db.connect((error)=>{

    if(error){
        console.log(error);

    }else{
        console.log("working");

    }

});

  app.post('/login', async (req, res) => {
    let email = req.body.email ;
    let password = req.body.password;
  

    let sql = 'SELECT * FROM users WHERE email =' + mysql.escape(email) ;
    db.query(sql ,(err, result, fields) => {
        if (err) throw err;
        console.log(result);
        if(result.length === 0 ){
            console.log("no user found");
        }
        else{
            const user = {
                id: result[0].id,
                name: result[0].name,
                email:result[0].email,
                password:result[0].password,
                role:result[0].role
            }
             try {
                 if( bcrypt.compareSync(req.body.password , user.password)){
                   
                    const accessToken = jwt.sign(user , process.env.ACCESS_TOKEN_SECRET);
                    res.json({
                                status: 200 ,
                                result ,
                                message:"user list retrieved successfully",
                                accessToken:accessToken
                    });
                 }
                 else{
                    console.log("password mis match ");
                 }
             } catch {
                 res.status(500).send();
             }

        }

      })

      
  });

  app.post('/Register', async (req, res) => {

    try{
        const salt = await bcrypt.genSalt();
        const hashedPassword =  await bcrypt.hash(req.body.password , salt);
        const name = req.body.name ;
        const email = req.body.email ;
        const Role = 'user';
        console.log(hashedPassword);
        let sql = 'INSERT INTO users (name , email , password , role) VALUES ('+ mysql.escape(name)+',' + mysql.escape(email)+','+ mysql.escape(hashedPassword)+','+ mysql.escape(Role)+')';
        db.query(sql ,(err, result, fields) => {
            if (err) throw err;
            res.json({
                status: 200 ,
                result ,
                message:" retrieved successfully"
            })
    
          })
    }catch {
        res.status(500);
    }

  });

  

app.listen(5000 , ()=>{
    console.log("this app is working");
    
});

app.get('/user',autheticateToken,(req , res) =>{
    let sql = 'SELECT * FROM users ';
        db.query(sql ,(err, result, fields) => {
            if (err) throw err;
            res.json({
                status: 200 ,
                result ,
                message:" retrieved successfully"
            })
          })
})

app.post('/idea',autheticateToken,(req , res) =>{
    try{
        const user_id = req.user.id ;
        const title = req.body.title ;
        const type = req.body.type ;
        const description = req.body.description ;
        console.log(req.body);
        let sql = 'INSERT INTO ideas ( user_id , title , type , description) VALUES ('+ mysql.escape(user_id)+',' + mysql.escape(title)+','+ mysql.escape(type)+','+ mysql.escape(description)+')';
        db.query(sql ,(err, result, fields) => {
            if (err) throw err;
            res.json({
                status: 200 ,
                result ,
                message:" retrieved successfully"
        });
      });
    }catch {
        res.status(500);
    }

})

app.get('/getIdeas',autheticateToken,(req , res) =>{
    try{
        let sql = 'SELECT * FROM ideas';
        db.query(sql ,(err, result, fields) => {
            if (err) throw err;
            res.json({
                status: 200 ,
                result ,
                message:" retrieved successfully"
        });
      });
    }catch {
        res.status(500);
    }

});


app.get('/getIdeasid',autheticateToken,(req , res) =>{
    try{
        const idea_id = req.body.id ;
       
        let sql = 'SELECT * FROM ideas WHERE id = '+ mysql.escape(idea_id);
        db.query(sql ,(err, result, fields) => {
            if (err) throw err;
            res.json({
                status: 200 ,
                result ,
                message:" retrieved successfully"
        });
        console.log(req.user);
      });
    }catch {
        res.status(500);
    }

});

app.get('/getIdeasuserid',autheticateToken,(req , res) =>{
    try{
        const user_id = req.user.id ;
        let sql = 'SELECT * FROM ideas WHERE user_id = ' + mysql.escape(user_id);
        db.query(sql ,(err, result, fields) => {
            if (err) throw err;
            res.json({
                status: 200 ,
                result ,
                message:" retrieved successfully"
        });
      });
    }catch {
        res.status(500);
    }

});

app.put('/Level1',autheticateToken, (req, res)=> {
    const id = req.body.id ;
    const level_1 = req.body.level_1 ;
    let sql = 'UPDATE ideas SET level_1 = '+mysql.escape(level_1)+' WHERE id = ' + mysql.escape(id);
    db.query(sql ,(err, result, fields) => {
        if (err) throw err;
        res.json({
            status: 200 ,
            result ,
            message:" retrieved successfully"
    });
  });
  });

app.put('/Level2',autheticateToken, (req, res)=> {
    const id = req.body.id ;
    const level_2 = req.body.level_2 ;
    let sql = 'UPDATE ideas SET level_2 = '+mysql.escape(level_2)+' WHERE id = ' + mysql.escape(id);
    db.query(sql ,(err, result, fields) => {
        if (err) throw err;
        res.json({
            status: 200 ,
            result ,
            message:" retrieved successfully"
    });
  });
  });

app.put('/Level3',autheticateToken, (req, res)=> {
    const id = req.body.id ;
    const level_3 = req.body.level_3 ;
    let level_2;
    let level_1;
    let total ;

    let sql1 = 'SELECT level_1 , level_2 , level_3 FROM ideas WHERE id = ' + mysql.escape(id);
     db.query(sql1 ,(err, result, fields) => {
        if (err) throw err;
        level_2 = result[0].level_2;
        level_1 = result[0].level_1;
        total = level_1 + level_2 + level_3;
        console.log(total);

    });
  


    let sql = 'UPDATE ideas SET level_3 = '+mysql.escape(level_3)+' WHERE id = ' + mysql.escape(id);
    db.query(sql ,(err, result, fields) => {
        if (err) throw err;
        res.json({
            status: 200 ,
            result ,
            message:" retrieved successfully"
    });

    console.log(total);
  });
  });


function autheticateToken(req , res , next){
    const authHeader =req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null){
        return res.sendStatus(401);
    }

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err , user) => {
        if(err) return res.sendStatus(403)
        req.user = user ;
        next();
    })

}



