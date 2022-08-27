var knex = require("../database/connection");
var User = require("./User");

class PasswordToken {
    async create(email) {
        var user = await User.findByEmail(email);
        if(user != undefined) {
            var token = Date.now();
            try{
                await knex.insert({
                    token: token,
                    user_id: user[0].id,
                    used: 0
                }).into("passwordTokens");
                return {status: true, token: token, resposta: user}
            }catch(error) {
                return {status: false, error: error};
            }
        }else{
            return {status: false, error: "O e-mail passado não existe no banco de dados"};
        }
    }

    async validate(token) {
        try{
            var response = await knex.select().where({token: token}).table("passwordTokens");
            if(response.length > 0) {
                var tk = response[0];
                if(tk.used != 0) {
                    return {error: "token ja usado", status: false}
                }else{
                    return {status: true, token: tk}
                }
            }else{
                return {error: "token não encontrado no banco de dados", status: false}
            }
        }catch(error) {
            return {error: error, status: false};
        }
    }

    async usedToken(token) {
        try{
            await knex.update({used: 1}).where({token: token}).table("passwordTokens");
        }catch(error) {
            console.log(error);
        }
    }
}

module.exports = new PasswordToken();