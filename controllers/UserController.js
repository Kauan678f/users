var User = require("../models/User")
class UserController {
    async index(request, response){
       var users = await User.findAll();
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
            console.log(error);
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
        response.json({response: "Tudo Ok"})
        response.status(200);
    }
}

module.exports = new UserController;