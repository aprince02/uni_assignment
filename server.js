// Create express app
var express = require("express")
var app = express()
var db = require("./database.js")
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Server port
var HTTP_PORT = 8000 
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});
// Root endpoint
app.get("/", (req, res) =>  {
    res.render("index");
  });

app.get("/claimants", (req, res) => {
    const sql = "SELECT * FROM claimant ORDER BY id ASC"
    db.all(sql, [], (err, rows) => {
        if (err) {
          return console.error(err.message);
        }
    res.render("claimants", {model: rows });
    console.log("GET: view all claimants details")
    });
  });

// GET /edit/5
app.get("/edit/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM claimant WHERE id = ?";
    db.get(sql, id, (err, row) => {
      // if (err) ...
      res.render("edit", { claimant: row });
    });
  });

app.get("/bank_account", (req, res) => {
    res.render("bank_account");
    console.log("GET: bank account page")
  });

app.get("/payments", (req, res) => {
    res.render("payments");
    console.log("GET: payments page")
  });

// Insert here other API endpoints

app.get("/api/users", (req, res, next) => {
    var sql = "select * from user"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

app.get("/api/user/:id", (req, res, next) => {
    var sql = "select * from user where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
});

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});