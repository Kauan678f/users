var knex = require("../database/connection");
var bcrypt = require("bcrypt");
var PasswordToken = require("./PasswordToken");

class User {

    async findAll(){
        try{
            var response = await knex.select(["id","name","email","role"]).table("users");
            return response;
        }catch(error){
            console.log(error);
            return [];
        }
    }

    async findById(id){
        try{
            var response = await knex.select(["id","name","email","role"]).table("users").where({id: id});
            if(response.length > 0) {
                return response;
            }else {
                return undefined;
            }
        }catch(error){
            console.log(error);
            return undefined;
        }
    }

    async findByEmail(email){
        try{
            var response = await knex.select(["id","name","email","password","role"]).table("users").where({email: email});
            if(response.length > 0) {
                return response;
            }else {
                return undefined;
            }
        }catch(error){
            console.log(error);
            return undefined;
        }
    }

    async new(name,email,password) {
        try{
            var hash = await bcrypt.hash(password, 10);

            await knex.insert({email,password: hash,name,role: 0}).into("users");
        }catch(error){
            console.log(error);
        }
    }

    // async findEmail(email) {
    //     try {
    //         var response = await knex.select("*").from("users").where({email: email});
    //         if (response.length > 0) {
    //             return true; 
    //         }else {
    //             return false;
    //         }
    //     }catch(error){
    //         console.log(error);
    //         return false;
    //     }
    // }

    async update(id,email,name,role) {
        var user = await this.findById(id);
        if(user != undefined) {
            var editUser = {}
            if(email != user.email) {
                var response = await this.findEmail(email);
                if(response == false){
                    editUser.email = email;
                }else {
                    return {status: false,error: "O e-mail ja está cadastrado"};
                }
            }

            if(name != undefined) {
                editUser.name = name;
            }

            if(role != undefined) {
                editUser.role = role;
            }
        }else{
            return {status: false,error: "O usuario não existe"};
        }

        try{
            await knex.update(editUser).where({id: id}).table("users");
            return {status: true};
        }catch(error) {
            console.log(error);
        }
    }

    async delete(id){
        var user = await this.findById(id);
        if(user != undefined) {
            try{
                await knex.delete().where({id: id}).table("users");
                return {status: true}
            }catch(error){
                return {status: false, error: error}
            }
        }else{
            return {status: false, error: "O usuario não existe"}
        }
    }

    async changePassword(newPassword,id,token) {
        var hash = await bcrypt.hash(newPassword, 10);
        await knex.update({password: hash}).where({id: id}).table("users");
        await PasswordToken.usedToken(token);
    }
}

module.exports = new User();