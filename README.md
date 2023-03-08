# Software Engineering & Agile Development Assignment

This repository contains the source code for the Web Database Application that I am creating using ExpressJS and SQLite for my university assignment.

The application is used to initiate payments that need to be paid to the claimants. Within the application, you can update the claimant details including first name, last name, date of birth, sort code, and account number. You are also able to add new claimants and delete claimants, depending on if you are logged in as an administrator. There is a login page, which will only grant access to further pages within the application after a successful login. You are also able to register as a new user to the application with a unique email and password. 

There will be three database tables including users, claimant, and payments. 

## API 1

### Path: `/claimants`
#### Method: `GET`

This endpoint, retrieves all claimants that are stored within the database table. The return is ordered by the id in ascending order.

## API 2

### Path: `/edit/id`
#### Method: `GET`

This endpoint retrieves a claimant with the corresponding id that is passed in the path of the request. 

## API 3

### Path: `/edit/id`
#### Method: `POST`

This endpoint updates the details stored for a claimant based on the id that is passed in the path.

## API 4

### Path: `/create`
#### Method: `POST`

This endpoint creates a new claimant and inserts the details into the claimant database table.

## API 5

### Path: `/delete/id`
#### Method: `POST`

This endpoint uses the id that is passed in the path to find and delete a claimant from the database table. Before this endpoint runs the sql delete query, it utilises the `checkUserRole` function to make sure that the logged in user has the role `admin`. 

## API 6

### Path: `/payments/id`
#### Method: `GET`

This endpoint uses the id passed in the path to retrieve all the payments associated with the claimant. 

## API 7

### Path: `/add-payment/id`
#### Method: `POST`

This endpoint adds a new payment record to the payments database table with the assocating claimant id that is passed in the path.

## API 8

### Path: `/register`
#### Method: `POST`

This endpoint creates a new entry in the user database table with the data that is passed in the body with the role `user`.

## API 9

### Path: `/login`
#### Method: `POST`

This endpoint checks the submitted email and password against stored login details in the user database table. 

## API 10

### Path: `/logout`
#### Method: `GET`

This endpoint destroys the current session that is stored, so that the logged in details are not stored anymore. 