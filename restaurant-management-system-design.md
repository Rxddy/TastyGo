# Restaurant Management System: Object-Oriented Design & MongoDB Implementation

## 1. System Overview

Based on the class diagrams provided, this system appears to be a restaurant management platform with the following core components:
- User account management
- Restaurant menu management
- Customer order processing
- Review and rating system

## 2. Object-Oriented Design

### Class Relationships

```
Account --- Customer (1:1)
Customer --- Review (1:many)
Customer --- Order (1:many)
Menu --- MenuItem (1:many)
MenuItem --- Item (many:1)
Order --- Item (many:many)
```

### Class Descriptions

1. **Account Class**
   - Handles user authentication and credentials
   - Properties: AccNum, AccDate, AccUsername, AccPassword
   - Methods: Create/delete account, get/set credentials

2. **Customer Class**
   - Represents a customer in the system
   - Properties: CusFullName, CusPayment, CusOrderHistory, CusOrders, CusReviews
   - Methods: Get/set customer information, manage orders and reviews

3. **Review Class**
   - Represents customer feedback for restaurants
   - Properties: RevNum, RevRestaurantNum, RevCusNum, RevRating, RevBody
   - Methods: Create/delete reviews, get review information

4. **Menu Class**
   - Represents a restaurant's menu
   - Properties: MenuItems, MenuNum
   - Methods: Create/delete menu, add/remove/get menu items

5. **MenuItem Class**
   - Represents an item on a menu
   - Properties: MenuItemNum, MenuItemName, MenuItemPrice, MenuItemImage, MenuItemDesc
   - Methods: Create/delete menu items, get/set item information

6. **Item Class**
   - Represents a specific item that can be ordered
   - Properties: ItemNum, ItemPrice, ItemCustomize, ItemMenuItemNum
   - Methods: Create/delete items, get/set item information

## 3. MongoDB Database Design

MongoDB is an excellent choice for this system due to its flexibility with complex, nested data structures and its ability to handle varying attributes across documents.

### Database Structure

```javascript
// Database: RestaurantManagementSystem
```

### Collections

#### 1. accounts
```javascript
{
  _id: ObjectId(),
  accNum: Number,
  username: String,
  password: String,  // Should be hashed and salted
  createdAt: Date,
  lastLogin: Date,
  isActive: Boolean
}
```

#### 2. customers
```javascript
{
  _id: ObjectId(),
  accountId: ObjectId(),  // Reference to accounts collection
  fullName: String,
  contactInfo: {
    email: String,
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String
    }
  },
  paymentMethods: [
    {
      type: String,  // "credit", "debit", "paypal", etc.
      details: Object,  // Card number (encrypted), expiry, etc.
      isDefault: Boolean
    }
  ],
  orderHistory: [ObjectId()],  // References to orders collection
  reviews: [ObjectId()]  // References to reviews collection
}
```

#### 3. restaurants
```javascript
{
  _id: ObjectId(),
  name: String,
  location: {
    address: String,
    coordinates: {
      type: "Point",
      coordinates: [Number, Number]  // [longitude, latitude]
    }
  },
  cuisine: [String],
  operatingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    // ... other days
  },
  contactInfo: {
    phone: String,
    email: String,
    website: String
  },
  menus: [ObjectId()],  // References to menus collection
  averageRating: Number,
  reviews: [ObjectId()]  // References to reviews collection
}
```

#### 4. menus
```javascript
{
  _id: ObjectId(),
  restaurantId: ObjectId(),  // Reference to restaurants collection
  menuNum: Number,
  name: String,
  description: String,
  type: String,  // "breakfast", "lunch", "dinner", "special", etc.
  availableTimes: {
    startTime: String,
    endTime: String
  },
  menuItems: [ObjectId()]  // References to menuItems collection
}
```

#### 5. menuItems
```javascript
{
  _id: ObjectId(),
  menuId: ObjectId(),  // Reference to menus collection
  menuItemNum: Number,
  name: String,
  description: String,
  price: Number,
  category: String,  // "appetizer", "main course", "dessert", etc.
  imageUrl: String,
  allergens: [String],
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  isAvailable: Boolean,
  customizationOptions: [String]  // References to customization options
}
```

#### 6. items
```javascript
{
  _id: ObjectId(),
  itemNum: Number,
  menuItemId: ObjectId(),  // Reference to menuItems collection
  price: Number,  // Base price before customization
  customizations: [
    {
      name: String,
      options: [
        {
          name: String,
          additionalPrice: Number
        }
      ]
    }
  ]
}
```

#### 7. orders
```javascript
{
  _id: ObjectId(),
  orderNum: Number,
  customerId: ObjectId(),  // Reference to customers collection
  restaurantId: ObjectId(),  // Reference to restaurants collection
  items: [
    {
      itemId: ObjectId(),  // Reference to items collection
      quantity: Number,
      customizations: [
        {
          name: String,
          selectedOption: String,
          additionalPrice: Number
        }
      ],
      price: Number  // Price after customizations
    }
  ],
  status: String,  // "pending", "confirmed", "preparing", "ready", "delivered", "cancelled"
  orderTime: Date,
  deliveryTime: Date,
  totalAmount: Number,
  paymentMethod: {
    type: String,
    details: Object
  },
  paymentStatus: String,  // "pending", "completed", "failed", "refunded"
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  specialInstructions: String
}
```

#### 8. reviews
```javascript
{
  _id: ObjectId(),
  revNum: Number,
  customerId: ObjectId(),  // Reference to customers collection
  restaurantId: ObjectId(),  // Reference to restaurants collection
  orderId: ObjectId(),  // Reference to orders collection
  rating: Number,  // 1-5 stars
  title: String,
  body: String,
  images: [String],  // URLs to review images
  createdAt: Date,
  updatedAt: Date,
  helpfulVotes: Number,
  responses: [
    {
      from: String,  // "customer" or "restaurant"
      userId: ObjectId(),  // Reference to the user who responded
      message: String,
      createdAt: Date
    }
  ]
}
```

## 4. Implementation Steps

### 1. Set Up MongoDB Environment

1. Install MongoDB Community Edition or use MongoDB Atlas (cloud-based)
2. Set up a MongoDB connection in your application

```javascript
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://localhost:27017/RestaurantManagementSystem";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db("RestaurantManagementSystem");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}
```

### 2. Create Data Models

Using a framework like Mongoose (for Node.js) to create schemas and models:

```javascript
// Example Mongoose schema for MenuItem
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MenuItemSchema = new Schema({
  menuItemNum: {
    type: Number,
    required: true,
    unique: true
  },
  menuId: {
    type: Schema.Types.ObjectId,
    ref: 'Menu',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  imageUrl: String,
  allergens: [String],
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  customizationOptions: [String]
});

module.exports = mongoose.model('MenuItem', MenuItemSchema);
```

### 3. Implement CRUD Operations

For each collection, implement Create, Read, Update, and Delete operations:

```javascript
// Example service for MenuItem operations
class MenuItemService {
  constructor(db) {
    this.collection = db.collection('menuItems');
  }

  async createMenuItem(menuItemData) {
    const result = await this.collection.insertOne(menuItemData);
    return result.insertedId;
  }

  async getMenuItemById(id) {
    return await this.collection.findOne({ _id: id });
  }

  async updateMenuItem(id, updateData) {
    const result = await this.collection.updateOne(
      { _id: id },
      { $set: updateData }
    );
    return result.modifiedCount > 0;
  }

  async deleteMenuItem(id) {
    const result = await this.collection.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async getMenuItemsByMenuId(menuId) {
    return await this.collection.find({ menuId: menuId }).toArray();
  }
}
```

### 4. Implement Business Logic

Implement class methods that correspond to the Object-Oriented Design:

```javascript
// Example implementation of Review class methods
class ReviewService {
  constructor(db) {
    this.collection = db.collection('reviews');
    this.restaurantCollection = db.collection('restaurants');
  }

  async createReview(reviewData) {
    const result = await this.collection.insertOne(reviewData);
    
    // Update restaurant average rating
    await this.updateRestaurantRating(reviewData.restaurantId);
    
    return result.insertedId;
  }

  async updateRestaurantRating(restaurantId) {
    const pipeline = [
      { $match: { restaurantId: restaurantId } },
      { $group: { _id: null, averageRating: { $avg: "$rating" } } }
    ];
    
    const result = await this.collection.aggregate(pipeline).toArray();
    
    if (result.length > 0) {
      await this.restaurantCollection.updateOne(
        { _id: restaurantId },
        { $set: { averageRating: result[0].averageRating } }
      );
    }
  }

  // Other methods...
}
```

### 5. Create API Endpoints or Interface

Implement REST API endpoints or a user interface to interact with your system:

```javascript
// Example Express.js endpoint for creating a review
app.post('/api/reviews', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const reviewService = new ReviewService(db);
    
    const reviewData = {
      revNum: req.body.revNum,
      customerId: new ObjectId(req.body.customerId),
      restaurantId: new ObjectId(req.body.restaurantId),
      orderId: new ObjectId(req.body.orderId),
      rating: req.body.rating,
      title: req.body.title,
      body: req.body.body,
      createdAt: new Date(),
      updatedAt: new Date(),
      helpfulVotes: 0,
      responses: []
    };
    
    const reviewId = await reviewService.createReview(reviewData);
    res.status(201).json({ id: reviewId });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: "Failed to create review" });
  }
});
```

### 6. Implement Authentication and Authorization

Secure your API endpoints and implement user authentication:

```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// User authentication service
class AuthService {
  constructor(db) {
    this.collection = db.collection('accounts');
  }

  async authenticateUser(username, password) {
    const user = await this.collection.findOne({ username });
    
    if (!user) {
      return null;
    }
    
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return null;
    }
    
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    return { token, user: { id: user._id, username: user.username } };
  }
}

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    
    req.user = user;
    next();
  });
}
```

### 7. Implement Data Validation

Add validation to ensure data integrity:

```javascript
const Joi = require('joi');

// Validation schema for creating a review
const reviewSchema = Joi.object({
  revNum: Joi.number().required(),
  customerId: Joi.string().required(),
  restaurantId: Joi.string().required(),
  orderId: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  title: Joi.string().max(100).required(),
  body: Joi.string().max(1000).required(),
  images: Joi.array().items(Joi.string().uri())
});

// Middleware to validate request body
function validateReview(req, res, next) {
  const { error } = reviewSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  
  next();
}

// Use validation middleware in route
app.post('/api/reviews', validateReview, async (req, res) => {
  // Route handler implementation
});
```

## 5. Database Optimization

### Indexing

Create indexes for frequently queried fields:

```javascript
// Create indexes for common queries
db.customers.createIndex({ "accountId": 1 });
db.menuItems.createIndex({ "menuId": 1 });
db.orders.createIndex({ "customerId": 1 });
db.orders.createIndex({ "status": 1 });
db.reviews.createIndex({ "restaurantId": 1 });
db.reviews.createIndex({ "customerId": 1 });
```

### Compound Indexes

Create compound indexes for queries that filter on multiple fields:

```javascript
db.orders.createIndex({ "restaurantId": 1, "status": 1 });
db.menuItems.createIndex({ "menuId": 1, "isAvailable": 1 });
```

### Geospatial Indexes

For location-based queries:

```javascript
db.restaurants.createIndex({ "location.coordinates": "2dsphere" });
```

## 6. Testing

Implement unit and integration tests for your database operations:

```javascript
// Example test for createMenuItem function
describe('MenuItemService', () => {
  let db;
  let menuItemService;
  
  beforeAll(async () => {
    db = await connectToTestDatabase();
    menuItemService = new MenuItemService(db);
  });
  
  afterAll(async () => {
    await db.collection('menuItems').drop();
    await closeDatabase();
  });
  
  test('should create a new menu item', async () => {
    const menuItemData = {
      menuItemNum: 1,
      menuId: new ObjectId(),
      name: "Test Item",
      description: "Test description",
      price: 9.99,
      isAvailable: true
    };
    
    const id = await menuItemService.createMenuItem(menuItemData);
    expect(id).toBeDefined();
    
    const savedItem = await menuItemService.getMenuItemById(id);
    expect(savedItem).toMatchObject(menuItemData);
  });
});
```
