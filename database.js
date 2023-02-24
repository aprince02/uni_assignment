var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            email text UNIQUE, 
            password text, 
            CONSTRAINT email_unique UNIQUE (email)
            )`,
        (err) => {
            if (err) {
                // Table already created
                console.log('table already created')
            }else{
                // Table just created, creating some rows
                var insert_users = 'INSERT INTO user (name, email, password) VALUES (?,?,?)'
                db.run(insert_users, ["admin","admin@example.com",md5("admin123456")])
                db.run(insert_users, ["user","user@example.com",md5("user123456")])
            }
        }); 
        db.run(`CREATE TABLE claimant (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name text,
            surname text,
            date_of_birth date,
            claim_status text,
            sort_code INTEGER,
            account_number INTEGER
            )`,
        (err) => {
            if (err) {
                // Table already created
                console.log('table already created')
            }else{
                // Table just created, creating some rows
                var insert_claimants = 'INSERT INTO claimant (first_name, surname, date_of_birth, claim_status, sort_code, account_number) VALUES (?,?,?,?,?,?)'
                db.run(insert_claimants, ["John", "Doe", "2000-01-01", "ACTIVE", "123456", "12345678"])
                db.run(insert_claimants, ["Mary", "Anne", "2000-01-01", "ACTIVE", "123456", "12345678"])
                db.run(insert_claimants, ["Sam", "Smith", "2000-01-01", "EXPIRED", "123456", "12345678"])
            }
        });  
    }
});


module.exports = db