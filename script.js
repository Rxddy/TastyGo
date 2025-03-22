// Map styles array (add this at the beginning of the file)
const mapStyles = [
  {
    featureType: "all",
    elementType: "labels.text.fill",
    stylers: [{ color: "#7c93a3" }],
  },
  {
    featureType: "administrative.country",
    elementType: "geometry",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ color: "#f5f5f5" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#e8e8e8" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#d8d8d8" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#c9d1d3" }],
  }
];

// Global variables
let map;
let autocomplete;
let mapInitialized = false;
let selectedAddress = null;
let currentUser = null;

// Initialize cart as a global variable
let cart = {
  items: [],
  restaurant: null,
  subtotal: 0,
  deliveryFee: 0,
  total: 0
};

// Initialize cart from localStorage
function initializeCart() {
  console.log('Initializing cart...');
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    try {
      const parsedCart = JSON.parse(savedCart);
      cart = {
        items: parsedCart.items || [],
        restaurant: parsedCart.restaurant || null,
        subtotal: parsedCart.subtotal || 0,
        deliveryFee: parsedCart.deliveryFee || 0,
        total: parsedCart.total || 0
      };
      updateCartIndicator();
      console.log('Cart initialized:', cart);
    } catch (error) {
      console.error('Error loading cart:', error);
      localStorage.removeItem('cart');
    }
  }
}

// Update cart indicator
function updateCartIndicator() {
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    cartCount.textContent = cart.items.length.toString();
  }
}

// Make cart functions globally available
window.initializeCart = initializeCart;
window.updateCartIndicator = updateCartIndicator;

// Other global variables
let orders = [];
let favorites = [];

// Promo codes configuration
const promoCodes = {
  'WELCOME10': { discount: 0.1, description: '10% off your first order' },
  'FREESHIP': { discount: 0, freeShipping: true, description: 'Free shipping on your order' }
};

// Check if we're running on GitHub Pages
const isGitHubPages = window.APP_CONFIG && window.APP_CONFIG.isGitHubPages;

// Dark mode map style for Google Maps
const DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

// Restaurant data
const restaurants = [
  {
    id: 1,
    name: "Burger Palace",
    cuisine: "Fast Food",
    price: "$$",
    logo: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
    rating: 4.5,
    deliveryTime: "15-25 min",
    deliveryFee: "$2.99",
    tags: ["Burgers", "Fast Food", "American"],
    menu: [
      { name: "Classic Burger", price: 8.99, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60" },
      { name: "Cheeseburger", price: 9.99, image: "https://images.unsplash.com/photo-1550317138-10000687a72b?w=500&auto=format&fit=crop&q=60" },
      { name: "Double Burger", price: 12.99, image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500&auto=format&fit=crop&q=60" },
      { name: "Chicken Sandwich", price: 8.99, image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&auto=format&fit=crop&q=60" },
      { name: "French Fries", price: 3.99, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60" }
    ]
  },
  {
    id: 2,
    name: "Pizza Heaven",
    cuisine: "Italian",
    price: "$$",
    logo: "https://cdn-icons-png.flaticon.com/512/3132/3132693.png",
    rating: 4.3,
    deliveryTime: "25-35 min",
    deliveryFee: "$1.99",
    tags: ["Pizza", "Italian", "Pasta"],
    menu: [
      { name: "Margherita Pizza", price: 12.99, image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500&auto=format&fit=crop&q=60" },
      { name: "Pepperoni Pizza", price: 14.99, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=60" },
      { name: "Cheese Pizza", price: 13.99, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60" },
      { name: "Spaghetti Bolognese", price: 11.99, image: "https://images.unsplash.com/photo-1622973536968-3ead9e780960?w=500&auto=format&fit=crop&q=60" },
      { name: "Garlic Bread", price: 4.99, image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=500&auto=format&fit=crop&q=60" }
    ]
  },
  {
    id: 3,
    name: "Sushi Express",
    cuisine: "Japanese",
    price: "$$$",
    logo: "https://cdn-icons-png.flaticon.com/512/2252/2252075.png",
    rating: 4.7,
    deliveryTime: "20-30 min",
    deliveryFee: "$3.99",
    tags: ["Sushi", "Japanese", "Asian", "Healthy"],
    menu: [
      { name: "California Roll (8pcs)", price: 9.99, image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&auto=format&fit=crop&q=60" },
      { name: "Salmon Nigiri (4pcs)", price: 8.99, image: "https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=500&auto=format&fit=crop&q=60" },
      { name: "Tuna Roll (8pcs)", price: 10.99, image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=500&auto=format&fit=crop&q=60" },
      { name: "Vegetable Roll (8pcs)", price: 7.99, image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=500&auto=format&fit=crop&q=60" },
      { name: "Miso Soup", price: 2.99, image: "https://images.unsplash.com/photo-1607330289024-1535c6b4e1c1?w=500&auto=format&fit=crop&q=60" }
    ]
  },
  {
    id: 4,
    name: "Taco Fiesta",
    cuisine: "Mexican",
    price: "$$",
    logo: "https://cdn-icons-png.flaticon.com/512/6002/6002217.png",
    rating: 4.2,
    deliveryTime: "15-25 min",
    deliveryFee: "$2.49",
    tags: ["Mexican", "Tacos", "Fast Food"],
    menu: [
      { name: "Street Tacos (3pcs)", price: 6.99, image: "https://cdn-icons-png.flaticon.com/512/4727/4727450.png" },
      { name: "Chicken Quesadilla", price: 9.99, image: "https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=500&auto=format&fit=crop&q=60" },
      { name: "Vegetarian Burrito", price: 8.99, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&auto=format&fit=crop&q=60" },
      { name: "Nachos Supreme", price: 7.99, image: "https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=500&auto=format&fit=crop&q=60" },
      { name: "Guacamole & Chips", price: 4.99, image: "https://images.unsplash.com/photo-1600335895229-6e75511892c8?w=500&auto=format&fit=crop&q=60" }
    ]
  },
  {
    id: 5,
    name: "Golden Dragon",
    cuisine: "Chinese",
    price: "$$",
    logo: "https://cdn-icons-png.flaticon.com/512/1471/1471262.png",
    rating: 4.4,
    deliveryTime: "25-40 min",
    deliveryFee: "$2.99",
    tags: ["Chinese", "Asian", "Noodles"],
    menu: [
      { name: "Kung Pao Chicken", price: 12.99, image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500&auto=format&fit=crop&q=60" },
      { name: "Beef with Broccoli", price: 13.99, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&auto=format&fit=crop&q=60" },
      { name: "Vegetable Fried Rice", price: 9.99, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&auto=format&fit=crop&q=60" },
      { name: "Spring Rolls (4pcs)", price: 5.99, image: "https://images.unsplash.com/photo-1606335543042-57c525922933?w=500&auto=format&fit=crop&q=60" },
      { name: "Wonton Soup", price: 4.99, image: "https://images.unsplash.com/photo-1626309549942-9cf8d2fb0903?w=500&auto=format&fit=crop&q=60" }
    ]
  },
  {
    id: 6,
    name: "Healthy Greens",
    cuisine: "Salads",
    price: "$$$",
    logo: "https://cdn-icons-png.flaticon.com/512/1147/1147805.png",
    rating: 4.6,
    deliveryTime: "15-25 min",
    deliveryFee: "$3.49",
    tags: ["Salads", "Healthy", "Vegan"],
    menu: [
      { name: "Caesar Salad", price: 10.99, image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&auto=format&fit=crop&q=60" },
      { name: "Greek Salad", price: 11.99, image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=60" },
      { name: "Quinoa Bowl", price: 12.99, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60" },
      { name: "Avocado Toast", price: 8.99, image: "https://images.unsplash.com/photo-1603046891744-76e6300f82ef?w=500&auto=format&fit=crop&q=60" },
      { name: "Fresh Fruit Smoothie", price: 5.99, image: "https://images.unsplash.com/photo-1553530666-ba9599a7e63c?w=500&auto=format&fit=crop&q=60" }
    ]
  },
  {
    id: 7,
    name: "Spice of India",
    cuisine: "Indian",
    price: "$$",
    logo: "https://cdn-icons-png.flaticon.com/512/5930/5930300.png",
    rating: 4.5,
    deliveryTime: "30-45 min",
    deliveryFee: "$2.99",
    tags: ["Indian", "Curry", "Asian"],
    menu: [
      { name: "Butter Chicken", price: 14.99, image: "https://cdn-icons-png.flaticon.com/512/4781/4781223.png" },
      { name: "Vegetable Biryani", price: 12.99, image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&auto=format&fit=crop&q=60" },
      { name: "Lamb Curry", price: 15.99, image: "https://images.unsplash.com/photo-1585937421612-70a008356c36?w=500&auto=format&fit=crop&q=60" },
      { name: "Garlic Naan", price: 3.99, image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=60" },
      { name: "Samosas (2pcs)", price: 4.99, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=60" }
    ]
  },
  {
    id: 8,
    name: "Mediterranean Delight",
    cuisine: "Mediterranean",
    price: "$$$",
    logo: "https://cdn-icons-png.flaticon.com/512/5861/5861566.png",
    rating: 4.8,
    deliveryTime: "25-40 min",
    deliveryFee: "$3.99",
    tags: ["Mediterranean", "Healthy", "Premium"],
    menu: [
      { name: "Lamb Kebab Plate", price: 16.99, image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=500&auto=format&fit=crop&q=60" },
      { name: "Falafel Wrap", price: 9.99, image: "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?w=500&auto=format&fit=crop&q=60" },
      { name: "Greek Salad", price: 11.99, image: "https://images.unsplash.com/photo-1551248429-40975aa4de74?w=500&auto=format&fit=crop&q=60" },
      { name: "Hummus & Pita", price: 6.99, image: "https://images.unsplash.com/photo-1577805947697-89e18249d767?w=500&auto=format&fit=crop&q=60" },
      { name: "Baklava", price: 4.99, image: "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=500&auto=format&fit=crop&q=60" }
    ]
  },
  {
    id: 9,
    name: "Fried Chicken Heaven",
    cuisine: "American",
    price: "$",
    logo: "https://cdn-icons-png.flaticon.com/512/1046/1046751.png",
    rating: 4.1,
    deliveryTime: "15-25 min",
    deliveryFee: "$1.99",
    tags: ["Chicken", "Fast Food", "American", "Deals"],
    menu: [
      { name: "Fried Chicken Bucket (8pcs)", price: 15.99, image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500&auto=format&fit=crop&q=60" },
      { name: "Chicken Sandwich", price: 7.99, image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&auto=format&fit=crop&q=60" },
      { name: "Chicken Tenders (5pcs)", price: 8.99, image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=60" },
      { name: "Mashed Potatoes", price: 3.99, image: "https://images.unsplash.com/photo-1600175074394-5d23b9f4d1e0?w=500&auto=format&fit=crop&q=60" },
      { name: "Coleslaw", price: 2.99, image: "https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?w=500&auto=format&fit=crop&q=60" }
    ]
  },
  {
    id: 10,
    name: "Steakhouse Supreme",
    cuisine: "Steakhouse",
    price: "$$$",
    logo: "https://cdn-icons-png.flaticon.com/512/3480/3480823.png",
    rating: 4.9,
    deliveryTime: "30-45 min",
    deliveryFee: "$4.99",
    tags: ["Steak", "Premium", "American"],
    menu: [
      { name: "Ribeye Steak", price: 29.99, image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500&auto=format&fit=crop&q=60" },
      { name: "Filet Mignon", price: 32.99, image: "https://images.unsplash.com/photo-1558030006-450675393462?w=500&auto=format&fit=crop&q=60" },
      { name: "New York Strip", price: 27.99, image: "https://images.unsplash.com/photo-1579366948929-444eb79881eb?w=500&auto=format&fit=crop&q=60" },
      { name: "Loaded Baked Potato", price: 6.99, image: "https://images.unsplash.com/photo-1633436375153-d7045cb93e38?w=500&auto=format&fit=crop&q=60" },
      { name: "Creamed Spinach", price: 5.99, image: "https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=500&auto=format&fit=crop&q=60" }
    ]
  },
  {
    id: 11,
    name: "Breakfast All Day",
    cuisine: "Breakfast",
    price: "$$",
    logo: "https://cdn-icons-png.flaticon.com/512/3361/3361434.png",
    rating: 4.3,
    deliveryTime: "15-25 min",
    deliveryFee: "$2.49",
    tags: ["Breakfast", "American", "Deals"],
    menu: [
      { name: "Pancake Stack", price: 8.99, image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&auto=format&fit=crop&q=60" },
      { name: "Eggs Benedict", price: 11.99, image: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=500&auto=format&fit=crop&q=60" },
      { name: "Breakfast Burrito", price: 9.99, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&auto=format&fit=crop&q=60" },
      { name: "French Toast", price: 8.99, image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=500&auto=format&fit=crop&q=60" },
      { name: "Fresh Orange Juice", price: 3.99, image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500&auto=format&fit=crop&q=60" }
    ]
  },
  {
    id: 12,
    name: "Gourmet Burgers",
    cuisine: "Burgers",
    price: "$$$",
    logo: "https://cdn-icons-png.flaticon.com/512/5787/5787253.png",
    rating: 4.7,
    deliveryTime: "20-30 min",
    deliveryFee: "$3.99",
    tags: ["Burgers", "Premium", "American"],
    menu: [
      { name: "Truffle Burger", price: 16.99, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60" },
      { name: "Wagyu Beef Burger", price: 18.99, image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&auto=format&fit=crop&q=60" },
      { name: "Portobello Mushroom Burger", price: 14.99, image: "https://images.unsplash.com/photo-1551782450-17144efb9c50?w=500&auto=format&fit=crop&q=60" },
      { name: "Sweet Potato Fries", price: 5.99, image: "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=500&auto=format&fit=crop&q=60" },
      { name: "Craft Beer", price: 6.99, image: "https://images.unsplash.com/photo-1566633806327-68e152aaf26d?w=500&auto=format&fit=crop&q=60" }
    ]
  },
  {
    id: 13,
    name: "Fresh Poke",
    cuisine: "Hawaiian",
    price: "$$$",
    logo: "https://cdn-icons-png.flaticon.com/512/3978/3978754.png",
    rating: 4.5,
    deliveryTime: "15-25 min",
    deliveryFee: "$3.49",
    tags: ["Poke", "Healthy", "Seafood"],
    menu: [
      { name: "Tuna Poke Bowl", price: 14.99, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60" },
      { name: "Salmon Poke Bowl", price: 14.99, image: "https://images.unsplash.com/photo-1563950708942-db5d9dcca7a7?w=500&auto=format&fit=crop&q=60" },
      { name: "Vegetarian Poke Bowl", price: 12.99, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60" },
      { name: "Seaweed Salad", price: 4.99, image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=60" },
      { name: "Miso Soup", price: 2.99, image: "https://images.unsplash.com/photo-1607330289024-1535c6b4e1c1?w=500&auto=format&fit=crop&q=60" }
    ]
  },
  {
    id: 14,
    name: "Noodle House",
    cuisine: "Asian Fusion",
    price: "$$",
    logo: "https://cdn-icons-png.flaticon.com/512/1471/1471262.png",
    rating: 4.4,
    deliveryTime: "20-30 min",
    deliveryFee: "$2.99",
    tags: ["Noodles", "Asian", "Ramen"],
    menu: [
      { name: "Tonkotsu Ramen", price: 13.99, image: "https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=500&auto=format&fit=crop&q=60" },
      { name: "Beef Pho", price: 12.99, image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500&auto=format&fit=crop&q=60" },
      { name: "Pad See Ew", price: 11.99, image: "https://images.unsplash.com/photo-1562967915-92ae0c320a01?w=500&auto=format&fit=crop&q=60" },
      { name: "Gyoza (6pcs)", price: 6.99, image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=500&auto=format&fit=crop&q=60" },
      { name: "Bubble Tea", price: 4.99, image: "https://images.unsplash.com/photo-1558857563-c0c6ee6ff8e4?w=500&auto=format&fit=crop&q=60" }
    ]
  },
  {
    id: 15,
    name: "Seafood Market",
    cuisine: "Seafood",
    price: "$$$",
    logo: "https://cdn-icons-png.flaticon.com/512/2555/2555884.png",
    rating: 4.8,
    deliveryTime: "30-45 min",
    deliveryFee: "$4.99",
    tags: ["Seafood", "Premium", "Healthy"],
    menu: [
      { name: "Grilled Salmon", price: 18.99, image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=60" },
      { name: "Shrimp Scampi", price: 16.99, image: "https://images.unsplash.com/photo-1633504581786-316f8ebee9a8?w=500&auto=format&fit=crop&q=60" },
      { name: "Lobster Roll", price: 21.99, image: "https://images.unsplash.com/photo-1559304822-9eb2813c9844?w=500&auto=format&fit=crop&q=60" },
      { name: "Clam Chowder", price: 7.99, image: "https://images.unsplash.com/photo-1594756202469-9ff9799b2e4e?w=500&auto=format&fit=crop&q=60" },
      { name: "Fish Tacos", price: 12.99, image: "https://images.unsplash.com/photo-1512838243191-e81e8f66f1fd?w=500&auto=format&fit=crop&q=60" }
    ]
  },
  {
    id: 16,
    name: "Taqueria Express",
    cuisine: "Mexican",
    price: "$",
    logo: "https://cdn-icons-png.flaticon.com/512/5787/5787016.png",
    rating: 4.2,
    deliveryTime: "10-20 min",
    deliveryFee: "$1.99",
    tags: ["Mexican", "Tacos", "Deals", "Fast Food"],
    menu: [
      { name: "Street Tacos (3pcs)", price: 6.99, image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500&auto=format&fit=crop&q=60" },
      { name: "Super Burrito", price: 8.99, image: "https://images.unsplash.com/photo-1584208632869-05fa2b2a5934?w=500&auto=format&fit=crop&q=60" },
      { name: "Chips & Salsa", price: 3.99, image: "https://images.unsplash.com/photo-1600335895229-6e75511892c8?w=500&auto=format&fit=crop&q=60" },
      { name: "Quesadilla", price: 7.99, image: "https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=500&auto=format&fit=crop&q=60" },
      { name: "Horchata", price: 2.99, image: "https://images.unsplash.com/photo-1620057803353-6b0d54d8d3b0?w=500&auto=format&fit=crop&q=60" }
    ]
  },
  {
    id: 17,
    name: "Korean BBQ Express",
    cuisine: "Korean",
    price: "$$",
    logo: "https://cdn-icons-png.flaticon.com/512/2276/2276931.png",
    rating: 4.6,
    deliveryTime: "25-35 min",
    deliveryFee: "$2.99",
    tags: ["Korean", "BBQ", "Asian"],
    menu: [
      {
        name: "Bulgogi Bowl",
        description: "Marinated beef with rice and vegetables",
        price: 16.99,
        image: "https://cdn-icons-png.flaticon.com/512/13459/13459912.png"
      },
      { name: "Korean BBQ Chicken", price: 14.99, image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500&auto=format&fit=crop&q=60" },
      { name: "Kimchi", price: 3.99, image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=60" },
      { name: "Bibimbap", price: 12.99, image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500&auto=format&fit=crop&q=60" },
      { name: "Mushroom Soup", price: 5.99, image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500&auto=format&fit=crop&q=60" }
    ]
  }
];

// Initialize Google Maps
function initializeMap() {
  if (mapInitialized) {
    console.log('Map already initialized, skipping...');
    return;
  }
  
  const mapContainer = document.getElementById('map');
  if (!mapContainer) {
    console.log('Map container not found, skipping initialization...');
    return;
  }

  // Check if Google Maps API is loaded
  if (!window.google || !window.google.maps) {
    console.error('Google Maps API failed to load. Debug info:', {
      googleExists: !!window.google,
      mapsExists: !!(window.google && window.google.maps),
      currentURL: window.location.href,
      protocol: window.location.protocol
    });
    
    showToast('Map service temporarily unavailable');
    
    // Add a message to the map container with more detailed information
    mapContainer.innerHTML = `
      <div style="padding: 20px; text-align: center; background: #f8f9fa; border-radius: 8px;">
        <p>Map service is temporarily unavailable.</p>
        <p>You can still add addresses manually.</p>
        <p style="font-size: 0.8em; color: #666;">
          Debug info: API not loaded correctly. 
          Please ensure your API key is properly configured for: ${window.location.href}
        </p>
      </div>
    `;
    return;
  }

  try {
    console.log('Attempting to initialize map...');
    
    // Default coordinates (can be updated based on user's location)
    const defaultLocation = { lat: 40.7128, lng: -74.0060 };
    
    // Create map
    map = new google.maps.Map(mapContainer, {
      center: defaultLocation,
      zoom: 13,
      styles: mapStyles
    });
    
    console.log('Map object created successfully');
    
    // Initialize autocomplete
    const addressInput = document.getElementById('address');
    if (addressInput) {
      console.log('Initializing autocomplete...');
      autocomplete = new google.maps.places.Autocomplete(addressInput, {
        types: ['address'],
        componentRestrictions: { country: 'us' }
      });
      
      // Add place_changed event listener
      autocomplete.addListener('place_changed', function() {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          showToast('Please select an address from the dropdown');
          return;
        }
        
        // Update map
        map.setCenter(place.geometry.location);
        map.setZoom(17);
        
        // Create marker
        new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });
      });
      console.log('Autocomplete initialized successfully');
    } else {
      console.log('Address input not found, skipping autocomplete');
    }
    
    mapInitialized = true;
    console.log('Map initialization completed successfully');
  } catch (error) {
    console.error('Error initializing map:', {
      error: error,
      message: error.message,
      stack: error.stack
    });
    showToast('Error loading map. Please try again.');
  }
}

// Function to show toast messages
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, setting up cart...');
  initializeCart();
  setupEventListeners();
  
  // Load saved address index
  const savedAddressIndex = localStorage.getItem('selectedAddressIndex');
  if (savedAddressIndex !== null) {
    selectedAddress = parseInt(savedAddressIndex);
    updateSelectedAddressDisplay();
  }
  
  // Initialize map if we're on the addresses tab
  const addressesTab = document.getElementById('addresses');
  if (addressesTab && addressesTab.classList.contains('active')) {
    initializeMap();
  }
});

// Add address function
function addAddress() {
  const addressInput = document.getElementById('address');
  const address = addressInput.value.trim();
  
  if (!address) {
    showToast('Please enter an address');
    return;
  }
  
  // Get addresses from localStorage
  const addresses = JSON.parse(localStorage.getItem('addresses')) || [];
  
  // Add new address
  addresses.push(address);
  
  // Save to localStorage
  localStorage.setItem('addresses', JSON.stringify(addresses));
  
  // Clear input
  addressInput.value = '';
  
  // Reload addresses
  loadAddresses();
  
  // Show success message
  showToast('Address added successfully');
}

// Load addresses function
function loadAddresses() {
  const addresses = JSON.parse(localStorage.getItem('addresses')) || [];
  const addressList = document.getElementById('address-list');
  
  if (!addressList) return;
  
  if (addresses.length === 0) {
    addressList.innerHTML = '<div class="no-addresses">No addresses saved</div>';
    return;
  }
  
  addressList.innerHTML = addresses.map((address, index) => `
    <li class="${selectedAddress === index ? 'selected' : ''}">
      <div class="address-text">${address}</div>
      <div class="address-actions">
        <button class="select-address-btn" onclick="selectAddress(${index})">
          ${selectedAddress === index ? 'Selected' : 'Select'}
        </button>
        <button class="delete-address-btn" onclick="deleteAddress(${index})">
          Delete
        </button>
      </div>
    </li>
  `).join('');
}

// Select address function
function selectAddress(index) {
  const addresses = JSON.parse(localStorage.getItem('addresses')) || [];
  if (index >= 0 && index < addresses.length) {
    selectedAddress = index;
    localStorage.setItem('selectedAddressIndex', index);
    loadAddresses();
    updateSelectedAddressDisplay();
    showToast('Delivery address updated');
  }
}

// Delete address function
function deleteAddress(index) {
  const addresses = JSON.parse(localStorage.getItem('addresses')) || [];
  
  if (index < 0 || index >= addresses.length) return;
  
  if (!confirm('Are you sure you want to delete this address?')) return;
  
  addresses.splice(index, 1);
  localStorage.setItem('addresses', JSON.stringify(addresses));
  
  if (selectedAddress === index) {
    selectedAddress = null;
    localStorage.removeItem('selectedAddressIndex');
  } else if (selectedAddress > index) {
    selectedAddress--;
    localStorage.setItem('selectedAddressIndex', selectedAddress);
  }
  
  loadAddresses();
  updateSelectedAddressDisplay();
  showToast('Address deleted successfully');
}

// Update selected address display
function updateSelectedAddressDisplay() {
  const display = document.getElementById('selected-address-display');
  if (!display) return;
  
  const addresses = JSON.parse(localStorage.getItem('addresses')) || [];
  if (selectedAddress !== null && addresses[selectedAddress]) {
    display.textContent = addresses[selectedAddress];
    display.classList.add('has-address');
  } else {
    display.textContent = 'Select delivery address';
    display.classList.remove('has-address');
  }
}

// Make address functions globally available
window.initializeMap = initializeMap;
window.addAddress = addAddress;
window.loadAddresses = loadAddresses;
window.selectAddress = selectAddress;
window.deleteAddress = deleteAddress;

// Setup event listeners
function setupEventListeners() {
  // Cart button
  const mainCartBtn = document.getElementById('main-cart-btn');
  if (mainCartBtn) {
    mainCartBtn.onclick = function() {
      showCart();
    };
  }

  // Settings button
  const settingsBtn = document.getElementById('settings-btn');
  if (settingsBtn) {
    settingsBtn.onclick = function(e) {
      e.stopPropagation();
      const settingsContent = document.querySelector('.settings-content');
      if (settingsContent) {
        settingsContent.style.display = settingsContent.style.display === 'block' ? 'none' : 'block';
      }
    };
  }

  // Close settings when clicking outside
  document.addEventListener('click', function(e) {
    const settingsContent = document.querySelector('.settings-content');
    if (settingsContent && settingsContent.style.display === 'block') {
      if (!e.target.closest('.settings-dropdown')) {
        settingsContent.style.display = 'none';
      }
    }
  });
}

// Show cart function
function showCart() {
  console.log('Opening cart...');
  const cartModal = document.createElement('div');
  cartModal.className = 'cart-modal';
  cartModal.style.display = 'flex';
  
  cartModal.innerHTML = `
    <div class="cart-content">
      <div class="cart-header">
        <h2>Your Cart</h2>
        <button class="close-cart-btn" onclick="closeCart()">&times;</button>
      </div>
      ${cart.items && cart.items.length > 0 ? `
        <div id="cart-delivery-address">
          Delivery to: ${selectedAddress ? JSON.parse(localStorage.getItem('addresses'))[selectedAddress] : 'Please select a delivery address'}
        </div>
        <div id="cart-list">
          ${cart.items.map((item, index) => `
            <div class="cart-item">
              <div>
                <h4>${item.name}</h4>
                ${item.options ? `
                  <p>${item.options.map(opt => `${opt.name}: ${opt.choice}`).join(', ')}</p>
                ` : ''}
                <p>$${(item.price * item.quantity).toFixed(2)}</p>
              </div>
              <div class="item-actions">
                <div class="quantity-controls">
                  <button onclick="updateQuantity(${index}, -1)">-</button>
                  <span>${item.quantity}</span>
                  <button onclick="updateQuantity(${index}, 1)">+</button>
                </div>
                <button class="remove-item-btn" onclick="removeFromCart(${index})">
                  Remove
                </button>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="cart-summary">
          <div>
            <span>Subtotal</span>
            <span>$${cart.subtotal.toFixed(2)}</span>
          </div>
          <div>
            <span>Delivery Fee</span>
            <span>$${cart.deliveryFee.toFixed(2)}</span>
          </div>
          <div class="final-total">
            <span>Total</span>
            <span>$${cart.total.toFixed(2)}</span>
          </div>
        </div>
        <button class="checkout-btn" onclick="showCheckout()">
          Proceed to Checkout
        </button>
      ` : `
        <div class="empty-cart">
          <p>Your cart is empty</p>
          <p>Add items from restaurants to start your order</p>
        </div>
      `}
    </div>
  `;
  
  document.body.appendChild(cartModal);

  // Add click event listener to close modal when clicking outside
  cartModal.addEventListener('click', function(e) {
    if (e.target === cartModal) {
      closeCart();
    }
  });
}

// Update quantity in cart
function updateQuantity(index, change) {
  console.log('Updating quantity...', index, change);
  const item = cart.items[index];
  if (!item) return;

  const newQuantity = item.quantity + change;
  if (newQuantity < 1) {
    removeFromCart(index);
  } else {
    item.quantity = newQuantity;
    updateCartTotals();
    saveCart();
    showCart(); // Refresh cart view
  }
}

// Remove item from cart
function removeFromCart(index) {
  console.log('Removing item from cart...', index);
  cart.items.splice(index, 1);
  if (cart.items.length === 0) {
    cart.restaurant = null;
  }
  updateCartTotals();
  saveCart();
  showCart(); // Refresh cart view
}

// Update cart totals
function updateCartTotals() {
  cart.subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cart.deliveryFee = cart.items.length > 0 ? parseFloat(cart.restaurant?.deliveryFee?.replace('$', '')) || 2.99 : 0;
  cart.total = cart.subtotal + cart.deliveryFee;
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartIndicator();
}

// Close cart
function closeCart() {
  console.log('Closing cart...');
  const cartModal = document.querySelector('.cart-modal');
  if (cartModal) {
    cartModal.remove();
  }
}

// Add to cart
function addToCart(restaurantId, itemName, price) {
  console.log('Adding to cart...', { restaurantId, itemName, price });
  const restaurant = restaurants.find(r => r.id === parseInt(restaurantId));
  if (!restaurant) return;

  // Check if adding from a different restaurant
  if (cart.restaurant && cart.restaurant.id !== restaurant.id) {
    if (!confirm('Adding items from a different restaurant will clear your current cart. Continue?')) {
      return;
    }
    cart.items = [];
  }

  // Set restaurant if cart is empty
  if (!cart.restaurant) {
    cart.restaurant = restaurant;
  }

  // Add item
  cart.items.push({
    name: itemName,
    price: parseFloat(price),
    quantity: 1
  });

  updateCartTotals();
  saveCart();
  showToast('Item added to cart');
}

// Make cart functions globally available
window.showCart = showCart;
window.closeCart = closeCart;
window.updateCartIndicator = updateCartIndicator;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.addToCart = addToCart;