// Create express app
var express = require("express")
var app = express()
var db = require("./database.js")
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

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

// GET /edit/id
app.get("/edit/:id", (req, res) => {
    const id = req.params.id;
    const claimant_sql = "SELECT * FROM claimant WHERE id = ?";
    db.get(claimant_sql, id, (err, row) => {
      // if (err) ...
      res.render("edit", { claimant: row });
    });
  });

// POST /edit/id
app.post("/edit/:id", (req, res) => {
    const id = req.params.id;
    const claimant = [req.body.first_name, req.body.surname, req.body.date_of_birth, req.body.sort_code, req.body.account_number, id];
    const sql = "UPDATE claimant SET first_name = ?, surname = ?, date_of_birth = ?, sort_code = ?, account_number = ? WHERE (id = ?)";
    db.run(sql, claimant, err => {
      // if (err) ...
      console.log("UPDATE: updated claimant details for claimant with ID: %ID%".replace("%ID%", req.params.id))
      res.redirect("/claimants");
    });
  });

  // GET /create
app.get("/create", (req, res) => {
    res.render("create", { claimant: {}, bank_account: {} });
  });

// POST /create
app.post("/create", (req, res) => {
    const claimant_sql = "INSERT INTO claimant (first_name, surname, date_of_birth, claim_status, sort_code, account_number) VALUES (?, ?, ?, ?, ?, ?)";
    const status = "ACTIVE";
    const claimant = [req.body.first_name, req.body.surname, req.body.date_of_birth, req.body.sort_code, req.body.account_number, status];
    db.run(claimant_sql, claimant, err => {
      // if (err) ...
      
    });
    res.redirect("/claimants");
  });

  // GET /delete/id
app.get("/delete/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM claimant WHERE id = ?";
    db.get(sql, id, (err, row) => {
      // if (err) ...
      res.render("delete", { claimant: row });
    });
  });

  // POST /delete/id
app.post("/delete/:id", (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM claimant WHERE id = ?";
    db.run(sql, id, err => {
      // if (err) ...
      res.redirect("/claimants");
    });
  });

app.get("/payments/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM payments WHERE claimant_id = ?";
    db.all(sql, id, (err, rows) => {
        if (err) {
          return console.error(err.message);
        }
    res.render("payments", {model: rows });
    console.log("GET: view all payments details")
  });
  
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