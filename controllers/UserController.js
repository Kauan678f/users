var User = require("../models/User")
var PasswordToken = require("../models/PasswordToken")
var jwt = require("jsonwebtoken")
var bcrypt = require("bcrypt");

var secret = "ksdjfhghdjklsç~lkjhgfdsdfghjgkhljkçkjlhgkfjdsf"

class UserController {
    async index(request, response){
       var users = await User.findAll();
       response.status(200);
       response.json(users);
    }

    async findUserById(request, response) {
        var id = request.params.id;
        try{
            var user = await User.findById(id);
            if(user == undefined) {
                response.status(404);
                response.json({error: "Usuario não existe"})
            }else {
                response.status(200);
                response.json(user);
            }
        }catch(error){
            response.json({error: error})
        }
    }
    
    async create(request, response){
        var {email, name, password} = request.body;
        var emailExists = await User.findEmail(email);

        if(email == undefined) {
            response.status(400);
            response.json({error: "O e-mail é invalido"})
            return;
        }
        if(emailExists) {
            response.status(406);
            response.json({error: "E-mail ja cadastrado"});
            return;
        }


        await User.new(name,email,password)
        response.status(200);
    }

    async edit(request, response) {
        var {id,name,email,role} = request.body;
        var result = await User.update(id,email,name,role);
        if(result != undefined) {
            if(result.status) {
                response.status(200);
            }else{
                response.status(406);
                response.json({error: result.error});
            }
        }else {
            response.status(406);
            response.json({error: "Ocorreu um erro no servidor tente novamente"})
        }
    }

    async remove(request, response) {
        var id = request.params.id
        var result = await User.delete(id);
        if(result.status) {
            response.status(200);
        }else {
            response.status(406);
            response.json({error: result.error});
        }
    }

    async recovePassword(request, response) {
        var email = request.body.email;
        var result = await PasswordToken.create(email);
        if(result.status){
            response.json({response: result.token})
        }else{
            response.status(406);
            response.json({error: result.error})
        }
    }

    async changePassword(request, response) {
        var token = request.body.token
        var password = request.body.password

        var isTokenValid = await PasswordToken.validate(token);
        if(isTokenValid.status){
            await User.changePassword(password,isTokenValid.token.user_id,isTokenValid.token.token); 
            response.status(200);
            response.json({response: "Senha alterada"});
        }else{
            response.status(406);
            response.json({error: isTokenValid.error})
        }
    }

    async login(request, response) {
        var {email, password} = request.body
        var user = await User.findByEmail(email);
        if(user != undefined) {
            var result = await bcrypt.compare(password,user[0].password)
            if(result){
                var token = await jwt.sign({ email: user[0].email, role: user[0].role }, secret, {expiresIn:'48h'})
                response.status(200)
                response.json({response: token})
            }else{
                response.status(406);
                response.json({error: "E-mail ou senha invalido", status: false})
            }
        }else{
            response.json({error: "E-mail ou senha invalido", status: false})
        }
    }
}

module.exports = new UserController;