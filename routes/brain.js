let express = require('express');
let router = express.Router();
let brain = require("brain.js")

router.get("/", (req, res) => {
    res.render("brain.html")
});


module.exports = router;