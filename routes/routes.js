var express = require("express")
var app = express;
var router = app.Router();
var UserController = require("../controllers/UserController")
var AdminAuth = require("../middleware/AdminAuth")

router.get('/',AdminAuth,UserController.index);
router.post("/user", UserController.create)
router.get("/user",AdminAuth,UserController.index)
router.get("/user/:id",AdminAuth,UserController.findUserById)
router.put("/user",AdminAuth,UserController.edit)
router.delete("/user/:id",AdminAuth,UserController.remove)
router.post("/recoverpassword", UserController.recovePassword)
router.post("/changepassword",UserController.changePassword)
router.post("/login",UserController.login)

module.exports = router;