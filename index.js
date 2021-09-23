const express = require('express');
const app = express();
const jwt = require('jsonwebtoken')
app.use(express.json())


const users = [{
    "id":1,
    "name":"talha",
    "password":"123",
    "isAdmin":"true"

},
{
    "id":2,
    "name":"zohaib",
    "password":"123",
    "isAdmin":"false"

}

]

app.post("/api/jwt",(req,res) => {

    const {name,password} = req.body
    const user = users.find((u)=>{
        return u.name === name && u.password === password
    })
    if(user){
        const accessToken = jwt.sign({id:user.id,isAdmin:user.isAdmin},"secretKey")
        res.json({
            name:user.name,
            isAdmin:user.isAdmin,
            accessToken
        })

    }else{
        res.status(400).json("name and password is incorrect")
    }

})

const verify = (req, res,next) => {
    const authHeader = req.headers.authorization
    if(authHeader){
        const token = authHeader.split(" ")[1];
        jwt.verify(token,"secretKey",(err,user)=>{
            if(err){
                return res.status(403).json("Token is not valid")
            }
            req.user = user
            next()
        })
    }else{
        res.status(401).json("you are not authenticated")
    }
}

app.delete("/api/users/:userId",verify,(req,res)=>{
    if(req.user.id === req.params.userId || req.user.isAdmin){
        res.status(200).json("user has been deleted")
    }else{
        res.status(403).json("you are not allowed to delete this user")
    }
})


app.listen(5000,()=>{
    console.log("App listening on 5000")
})