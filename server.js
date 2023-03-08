// Create express app
var express = require("express")
var app = express()
var db = require("./database.js")
var md5 = require('md5')
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const bcrypt = require('bcrypt');

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());
app.use(function(req, res, next){
    res.locals.message = req.flash();
    next();
});
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

app.get("/claimants", requireLogin, (req, res) => {
    const sql = "SELECT * FROM claimant ORDER BY id ASC"
    const loggedInName = req.session.name;
    db.all(sql, [], (err, rows) => {
        if (err) {
          return console.error(err.message);
        }
    res.render("claimants", {model: rows, loggedInName: loggedInName});
    console.log("GET: view all claimants details")
    });
  });

// GET /edit/id
app.get("/edit/:id", requireLogin, (req, res) => {
    const id = req.params.id;
    const loggedInName = req.session.name;
    const claimant_sql = "SELECT * FROM claimant WHERE id = ?";
    db.get(claimant_sql, id, (err, row) => {
      // if (err) ...
      res.render("edit", { claimant: row, loggedInName: loggedInName });
    });
  });

// POST /edit/id
app.post("/edit/:id", requireLogin, (req, res) => {
    const id = req.params.id;
    const loggedInName = req.session.name;
    const claimant = [req.body.first_name, req.body.surname, req.body.date_of_birth, req.body.sort_code, req.body.account_number, id];
    const sql = "UPDATE claimant SET first_name = ?, surname = ?, date_of_birth = ?, sort_code = ?, account_number = ? WHERE (id = ?)";
    db.run(sql, claimant, err => {
      // if (err) ...
      console.log("UPDATE: updated claimant details for claimant with ID: %ID%".replace("%ID%", req.params.id))
      req.flash('success', 'Claimant details updated successfully.');
      res.redirect("/claimants");
    });
  });

  // GET /create
app.get("/create", requireLogin, (req, res) => {
    const loggedInName = req.session.name;
    res.render("create", { claimant: {}, bank_account: {} , loggedInName: loggedInName });
  });

// POST /create
app.post("/create", requireLogin, (req, res) => {
    const claimant_sql = "INSERT INTO claimant (first_name, surname, date_of_birth, claim_status, sort_code, account_number) VALUES (?, ?, ?, ?, ?, ?)";
    const status = "ACTIVE";
    const loggedInName = req.session.name;
    const claimant = [req.body.first_name, req.body.surname, req.body.date_of_birth, status,  req.body.sort_code, req.body.account_number];
    db.run(claimant_sql, claimant, err => {
      // if (err) ...
      
    });
    req.flash('success', 'New claimant added successfully.');
    res.redirect("/claimants");
  });

  // GET /delete/id
app.get("/delete/:id", requireLogin, checkUserRole, (req, res) => {
    const id = req.params.id;
    const loggedInName = req.session.name;
    const sql = "SELECT * FROM claimant WHERE id = ?";
    db.get(sql, id, (err, row) => {
      // if (err) ...
      res.render("delete", { claimant: row, loggedInName: loggedInName });
    });
  });

  // POST /delete/id
app.post("/delete/:id", requireLogin, checkUserRole, (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM claimant WHERE id = ?";
    db.run(sql, id, err => {
      // if (err) ...
      req.flash('success', 'Claimant deleted successfully.');
      res.redirect("/claimants");
    });
  });

app.get("/payments/:id", requireLogin, (req, res) => {
    const id = req.params.id;
    const loggedInName = req.session.name;
    const sql = "SELECT * FROM payments WHERE claimant_id = ?";
    db.all(sql, id, (err, rows) => {
        if (err) {
          return console.error(err.message);
        }
    res.render("payments", {model: rows, id: id, loggedInName: loggedInName });
    console.log("GET: view all payments details")
  });
  
    });

    app.get("/add-payment/:id", requireLogin, (req, res) => {
        const id = req.params.id;
        const loggedInName = req.session.name;
        const payments_sql = "SELECT * FROM payments WHERE id = ?";
        db.get(payments_sql, id, (err, row) => {
          // if (err) ...
          res.render("add-payment", { claimant: row, id: id, loggedInName: loggedInName });
        });
      });
    
      app.post("/add-payment/:id", requireLogin, (req, res) => {
        const payment_sql = "INSERT INTO payments (claimant_id, amount, date, payment_status) VALUES (?, ?, ?, ?)";
        const pending_status = "PENDING";
        const id = req.params.id;
        
        const payment = [id, req.body.amount, formatted_date(), pending_status];
        db.run(payment_sql, payment, err => {
          // if (err) ...
          req.flash('success', 'Payment added successfully.');
          res.redirect("/claimants");
          
        });
      });

app.get("/register", (req, res) =>  {
    res.render("register");
  });

  app.post("/register", (req, res) => {
    const user_sql = "INSERT INTO user (name, email, password, role) VALUES (?, ?, ?, ?)";
    const password = md5(req.body.password);
    const role = "user";
    const user = [req.body.username, req.body.email, password, role];
    db.run(user_sql, user, err => {
      // if (err) ...
      
    });
    req.flash('success', 'New account created successfully.');
    res.redirect("/");
  });

  app.get("/login", (req, res) =>  {
    res.render("login");
  });

  app.post("/login", (req, res) =>  {
    const email = req.body.email;
    const password = req.body.password;
    db.get('SELECT * FROM user WHERE email = ?', [email], (err, row) => {
        if (err) {
          throw err;
        }
    
        if (!row) {
            console.log("row not found")
            req.flash('error', 'Invalid email or password.');
          return res.redirect('/login');
        }
        
        if (row.password !== password) {
            console.log(row.password)
            console.log("password not match")
            req.flash('error', 'Invalid email or password.');
          return res.redirect('/login');
        }
    
        // Login successful
        console.log("success")
        req.session.email = email;
        req.session.name = row.name;
        req.session.role = row.role;
        res.redirect('claimants');
      });
  });

  app.get('/logout', (req, res) => {
    req.session.destroy();
    req.flash('success', 'Logged out successfully.');
    res.redirect('/');
});

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});

function formatted_date() {
    var date_today = new Date();
    var dd = date_today.getDate();
    var mm = date_today.getMonth()+1;
    var yyyy = date_today.getFullYear();
    if(dd<10) {
        dd='0'+dd;
    } 
    if(mm<10) {
        mm='0'+mm;
    }
    var today = yyyy+'-'+mm+'-'+dd;
    return today;
}

function requireLogin(req, res, next) {
    if (req.session && req.session.email) {
      // user is logged in, so continue with the next middleware
      next();
    } else {
      // user is not logged in, so redirect to login page
      res.redirect('/login');
    }
  }

  function checkUserRole(req, res, next) {
    if (req.session.role === 'admin') {
        next();
    } else {
        console.log("Logged in user is not admin")
        req.flash('error', 'Only Admins are allowed to delete claimants.');
        res.redirect('/claimants');
    }
  }
  