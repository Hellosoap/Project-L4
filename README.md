# ECOMMERCE API

**SHOP**

- This API manages the data and logic for the SHOP website. It handles things like adding items to a cart, processing orders, and managing products. It gives you a great shopping experience!

*Built With:*

- Node.js
- Express.js
- MongoDB
- Mongoose

## KEY FEATURES

- Full Data Control: Complete ability to create, fetch, update, and delete products and categories.

- Advanced Filtering: Instantly fetch your desired products by filtering with price, search, category, and availability

- Dynamic Cart Management: Seamlessly add items, adjust quantities, and manage user shopping carts.

- Complete Order Flow: Handle the entire checkout process and update order statuses.

## APIs BUILT IN THE PROJECT

- Categories Module: Includes Create, Fetch, Update, and Delete (CRUD) operations.

- Products Module: Includes CRUD functionality plus filtering by category, stock availability, price, and search.

- Cart Module: Supports adding items, fetching a user's cart, updating item quantities, removing items, and clearing the entire cart.

- Orders Module: Handles creating new orders, retrieving all orders, fetching order details by ID, and updating order status.

## PREQUISITES

- Node.js
- MongoDB
- npm

## INSTALLATION STEPS

(1) - git clone https://github.com/Hellosoap/Project-L4.git

(2) - cd Project-L4

(3) - npm install

(4) - Create .env file (see table)

(5) - npm run seed

(6) - npm run dev


## ENVIROMENT VARIABLES TABLE

| Variable | Description | Example |
| :--- | :--- | :--- |
| PORT | Server port | 3000 |
| MONGODB_URI | MongoDB connection URL | mongodb://localhost:27017/Shop |
| NODE_ENV | Environment mode | development |


## API ENDPOINTS

*Note: If you run all the Postman tests at once, you might get errors.*
*This happens because some tests delete products that later tests are trying to use, not because of an issue with the API.*

### CATEGORIES API

| Method | URL | Description |
| :--- | :--- | :--- |
| GET | /api/categories | Get all categories |
| POST | /api/categories | Create a category |
| GET | /api/categories/:id | Gets a specific category |
| PATCH | /api/categories/:id | Updates a category |
| DELETE | /api/categories/:id | Deletes a category |

### PRODUCTS API

| Method | URL | Description |
| :--- | :--- | :--- |
| GET | /api/products | Get all products |
| POST | /api/products | Create a product |
| GET | /api/products/:id | Gets a specific product |
| GET | /api/products?inStock=... | Gets products filtered by inStock value |
| GET | /api/products?category=... | Get products filtered by category |
| GET | /api/products?minPrice=... | Get products filtered by minimum price |
| GET | /api/products?maxPrice=... | Get products filtered by maximum price |
| GET | /api/products?search=... | Get products filtered by search |
| PATCH | /api/products/:id | Updates a product |
| DELETE | /api/products/:id | Deletes a product |

### CARTS API

| Method | URL | Description |
| :--- | :--- | :--- |
| GET | /api/carts/:id | Get a specific cart |
| POST | /api/carts | Create a cart (or adds a product to an existing cart) |
| PATCH | /api/carts/:id | Updates quantity of a product in a cart |
| DELETE | /api/carts/:id | Clears the cart OR deletes a specific product if it was provided in req.body |

### ORDERS API

| Method | URL | Description |
| :--- | :--- | :--- |
| GET | /api/orders | Gets all orders |
| GET | /api/orders/:id | Gets a specific order |
| POST | /api/orders | Create an order |
| PATCH | /api/orders/:id/status | Updates ONLY the status of an order |
# PROJECT STRUCTURE

```text
WebL4 - Project/
├── config/        # Configuration files
├── controllers/   # Route controllers
├── models/        # Mongoose models
├── postman/       # Postman collection
├── routes/        # API routes
├── utils/         # Helper functions & Error handlers
├── .env           # Environment variables
├── .env.example   # Environment variables examples
├── .gitignore     # Git ignore rules
├── app.js         # main APP
├── seed.js        # Seed script
├── package.json   # Project dependencies
└── README.md      # Project documentation
```
