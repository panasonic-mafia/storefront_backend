# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index - get all products - `/products` [GET]
- Show - get one product by it's id - `/products/:id` [GET]
- Create - create product in products table - `/products` [POST] [token required]
- Update - update product in products table - `/products/:id` [PATCH] [token required]
- Delete - delete product from products table - `/products/:id` [DELETE] [token required]
- [OPTIONAL] Top 5 most popular products - `/products/top` [GET]
- [OPTIONAL] Products by category (args: product category) - `/products/category/:category` [GET]

#### Users
- Index - get all users - `/users` [GET] [token required]
- Show - get one user by it's id - `/users/:id` [GET] [token required]
- Create - create new user - `/users` [POST]
- Authenticate - authenticate via username and password - `/users/authenticate`
- Delete - delete user - `/users/:id` [DELETE] [token required]

#### Orders
- Create - create new order - `/orders` [POST] [token required]
- Update - update order - `/orders/:id` [PUT] [token required]
- Delete - delete order - `/orders/:id` [DELETE] [token required]
- Current Order by user (args: user id) - `/users/:id/orders/current` [GET] [token required]
- [OPTIONAL] Completed Orders by user (args: user id) - `/users/:id/orders/completed` [GET] [token required]

## Data Shapes
#### Product
-  id
- name
- price
- [OPTIONAL] category

#### User
- id
- username
- firstName
- lastName
- password 

#### Orders
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

## Data Tables
#### Products
- id SERIAL PRIMARY KEY
- name VARCHAR(255)
- price INTEGER

#### Users
- id  SERIAL PRIMARY KEY
- username VARCHAR(100)
- firstName VARCHAR(255)
- lastName VARCHAR(255)
- password_digest VARCHAR(255)

#### Orders
- id SERIAL PRIMARY KEY
- user_id BIGINT REFERENCES users(id)
- status VARCHAR(50)

#### Order_porducts
- id SERIAL PRIMARY KEY
- orderId BIGINT REFERENCES orders(id)
- productId BIGINT REFERENCES products(id)
- quantity INTEGER




