var knex = require("../database/connection");
var bcrypt = require("bcrypt");

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

    async new(name,email,password) {
        try{
            var hash = await bcrypt.hash(password, 10);

            await knex.insert({email,password: hash,name,role: 0}).into("users");
        }catch(error){
            console.log(error);
        }
    }

    async findEmail(email) {
        try {
            var response = await knex.select("*").from("users").where({email: email});
            if (response.length > 0) {
                return true; 
            }else {
                return false;
            }
        }catch(error){
            console.log(error);
            return false;
        }
    }
}

module.exports = new User();