var express = require("express");
var router = express.Router();

router.get("", function (req, res){
    res.sendFile("splash.html", {root: "./"});
});1

router.get("/battletanks", function (req, res){
    res.sendFile("choice.html", {root: "./"});
});
router.get("/game", function (req, res){
    res.sendFile("game.html", {root: "./"});
});
module.exports = router;