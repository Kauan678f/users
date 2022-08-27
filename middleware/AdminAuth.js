var jwt = require("jsonwebtoken");
var secret = "ksdjfhghdjklsç~lkjhgfdsdfghjgkhljkçkjlhgkfjdsf"

module.exports = function(request, response, next) {
    const authToken = request.headers['authorization']
    if(authToken != undefined){
        const bearer = authToken.split(' ');
        var token = bearer[1];
        try{
            var decoded = jwt.verify(token,secret);
            if(decoded.role == 1) {
                next();
            }else{
                response.status(403);
                response.json({error: "Você não é adm, por isso você não tem permissão para acessar essa rota"})
                return;
            }
        }catch(error){
            response.status(403);
            response.json({error: error})
            return;
        }
    }else{
        response.status(403);
        response.json({error: "Usuario não logado"});
        return;
    }
}