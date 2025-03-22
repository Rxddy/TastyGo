const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');
require('dotenv').config();

// Set mongoose options
mongoose.set('strictQuery', true);

console.log('Attempting to connect to MongoDB Atlas...');
console.log(`MongoDB URI: ${process.env.MONGODB_URI.replace(/:[^:]*@/, ':****@')}`); // Hide password in logs

// Connect to MongoDB with more detailed error handling
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true,
  w: 'majority'
}).then(() => {
  console.log('MongoDB Atlas Connected for seeding');
  console.log('Starting database seeding process...');
  seedDatabase();
}).catch(err => {
  console.error('Error connecting to MongoDB Atlas:', err);
  
  // Additional debug info
  if (err.name === 'MongoServerError') {
    if (err.code === 8000) {
      console.error('Authentication failed. Please check your username and password.');
      console.error('Make sure the user has appropriate permissions on the database.');
    } else if (err.code === 13) {
      console.error('Authentication mechanism failed. Check if the database user is properly set up.');
    } else if (err.code === 40) {
      console.error('Network error connecting to MongoDB. Check if your IP is whitelisted in MongoDB Atlas.');
    }
  }
  
  process.exit(1);
});

// Restaurant data based on script.js
const restaurantData = [
  {
    name: "Burger Palace",
    cuisine: "Fast Food",
    price: "$$",
    logo: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
    rating: 4.5,
    deliveryTime: "15-25 min",
    deliveryFee: 2.99,
    tags: ["Burgers", "Fast Food", "American"],
    location: {
      type: "Point",
      coordinates: [-74.0060, 40.7128] // Example NYC coordinates
    },
    menu: {
      mainItems: [
        {
          id: "bp1",
          name: "Classic Burger",
          price: 8.99,
          image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60",
          description: "Juicy beef patty with lettuce, tomato, and our special sauce"
        },
        {
          id: "bp2",
          name: "Cheeseburger",
          price: 9.99,
          image: "https://images.unsplash.com/photo-1550317138-10000687a72b?w=500&auto=format&fit=crop&q=60",
          description: "Classic burger topped with American cheese"
        },
        {
          id: "bp3",
          name: "Double Burger",
          price: 12.99,
          image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500&auto=format&fit=crop&q=60",
          description: "Double beef patties for the hungry appetite"
        },
        {
          id: "bp4",
          name: "Chicken Sandwich",
          price: 8.99,
          image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&auto=format&fit=crop&q=60",
          description: "Grilled chicken breast with fresh toppings"
        },
        {
          id: "bp5",
          name: "French Fries",
          price: 3.99,
          image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60",
          description: "Crispy golden fries"
        }
      ]
    }
  },
  {
    name: "Pizza Heaven",
    cuisine: "Italian",
    price: "$$",
    logo: "https://cdn-icons-png.flaticon.com/512/3132/3132693.png",
    rating: 4.3,
    deliveryTime: "25-35 min",
    deliveryFee: 1.99,
    tags: ["Pizza", "Italian", "Pasta"],
    location: {
      type: "Point",
      coordinates: [-73.9857, 40.7484] // Example NYC coordinates
    },
    menu: {
      mainItems: [
        {
          id: "ph1",
          name: "Margherita Pizza",
          price: 12.99,
          image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500&auto=format&fit=crop&q=60",
          description: "Classic pizza with tomato sauce, mozzarella, and basil"
        },
        {
          id: "ph2",
          name: "Pepperoni Pizza",
          price: 14.99,
          image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=60",
          description: "Pizza topped with pepperoni slices"
        },
        {
          id: "ph3",
          name: "Cheese Pizza",
          price: 13.99,
          image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60",
          description: "Extra cheesy pizza for cheese lovers"
        }
      ]
    }
  },
  {
    name: "Sushi Express",
    cuisine: "Japanese",
    price: "$$$",
    logo: "https://cdn-icons-png.flaticon.com/512/2252/2252075.png",
    rating: 4.7,
    deliveryTime: "20-30 min",
    deliveryFee: 3.99,
    tags: ["Sushi", "Japanese", "Asian", "Healthy"],
    location: {
      type: "Point",
      coordinates: [-73.9632, 40.7799] // Example NYC coordinates
    },
    menu: {
      mainItems: [
        {
          id: "se1",
          name: "California Roll",
          price: 9.99,
          image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&auto=format&fit=crop&q=60",
          description: "8pcs of crab, avocado and cucumber roll"
        },
        {
          id: "se2",
          name: "Salmon Nigiri",
          price: 8.99,
          image: "https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=500&auto=format&fit=crop&q=60",
          description: "4pcs of fresh salmon over rice"
        }
      ]
    }
  }
];

// Seed function
async function seedDatabase() {
  try {
    // Clear existing data
    await Restaurant.deleteMany({});
    console.log('Deleted all existing restaurants');

    // Insert new data
    const createdRestaurants = await Restaurant.insertMany(restaurantData);
    console.log(`Successfully seeded ${createdRestaurants.length} restaurants`);

    // Disconnect from MongoDB
    mongoose.disconnect();
    console.log('Database seeding completed');
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.disconnect();
  }
}

// Handle process termination
process.on('SIGINT', () => {
  mongoose.disconnect();
  console.log('Database connection closed through app termination');
  process.exit(0);
}); 