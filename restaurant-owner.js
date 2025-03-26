// Restaurant Owner Portal JavaScript

// Global variables
let currentRestaurantOwner = null;
let restaurantData = null;

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', function() {
  console.log('Restaurant portal initializing...');
  checkLoginStatus();
  setupEventListeners();
  checkDarkMode();
});

// Check local storage for login status
function checkLoginStatus() {
  const loggedInOwner = localStorage.getItem('currentRestaurantOwner');
  if (loggedInOwner) {
    currentRestaurantOwner = JSON.parse(loggedInOwner);
    showRestaurantDashboard();
    loadRestaurantData();
  }
}

// Check if dark mode is enabled
function checkDarkMode() {
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  const themeIcon = document.querySelector('.theme-toggle i');
  
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
    if (themeIcon) {
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    }
  } else {
    document.body.classList.remove('dark-mode');
    if (themeIcon) {
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
    }
  }
}

// Toggle dark mode
function toggleDarkMode() {
  const isDarkMode = document.body.classList.contains('dark-mode');
  const themeIcon = document.querySelector('.theme-toggle i');
  
  if (isDarkMode) {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'false');
    if (themeIcon) {
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
    }
  } else {
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'true');
    if (themeIcon) {
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    }
  }
}

// Setup event listeners
function setupEventListeners() {
  // Settings button
  const settingsBtn = document.getElementById('restaurant-settings-btn');
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
  
  // Dark mode toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleDarkMode);
  }
}

// Show login tab
function showLoginTab() {
  document.querySelector('#restaurant-login-form').classList.add('active');
  document.querySelector('#restaurant-signup-form').classList.remove('active');
  document.querySelector('.tab-buttons button:first-child').classList.add('active');
  document.querySelector('.tab-buttons button:last-child').classList.remove('active');
}

// Show signup tab
function showSignupTab() {
  document.querySelector('#restaurant-login-form').classList.remove('active');
  document.querySelector('#restaurant-signup-form').classList.add('active');
  document.querySelector('.tab-buttons button:first-child').classList.remove('active');
  document.querySelector('.tab-buttons button:last-child').classList.add('active');
}

// Login restaurant owner
function loginRestaurantOwner() {
  const username = document.getElementById('restaurant-username').value.trim();
  const password = document.getElementById('restaurant-password').value;
  
  if (!username || !password) {
    showToast('Please enter both username and password');
    return;
  }
  
  // Get restaurant owners from localStorage
  const restaurantOwners = JSON.parse(localStorage.getItem('restaurantOwners') || '[]');
  
  // Find restaurant owner
  const owner = restaurantOwners.find(o => o.username === username && o.password === password);
  
  if (!owner) {
    showToast('Invalid username or password');
    return;
  }
  
  // Store owner in localStorage
  localStorage.setItem('currentRestaurantOwner', JSON.stringify(owner));
  
  // Set global variable
  currentRestaurantOwner = owner;
  
  // Show dashboard
  showRestaurantDashboard();
  loadRestaurantData();
  
  showToast('Welcome back, ' + owner.username + '!');
}

// Register restaurant owner
function registerRestaurantOwner() {
  const username = document.getElementById('signup-username').value.trim();
  const password = document.getElementById('signup-password').value;
  
  if (!username || !password) {
    showToast('Username and password are required');
    return;
  }
  
  // Get other optional fields
  const restaurantName = document.getElementById('restaurant-name').value.trim();
  const cuisine = document.getElementById('restaurant-cuisine').value;
  const address = document.getElementById('restaurant-address').value.trim();
  const phone = document.getElementById('restaurant-phone').value.trim();
  const email = document.getElementById('restaurant-email').value.trim();
  const description = document.getElementById('restaurant-description').value.trim();
  
  // Get existing restaurant owners or initialize empty array
  const restaurantOwners = JSON.parse(localStorage.getItem('restaurantOwners') || '[]');
  
  // Check if username already exists
  if (restaurantOwners.some(owner => owner.username === username)) {
    showToast('Username already exists');
    return;
  }
  
  // Create new restaurant owner with restaurant data
  const newOwner = {
    id: Date.now().toString(),
    username: username,
    password: password,
    restaurant: {
      name: restaurantName || 'My Restaurant',
      cuisine: cuisine || '',
      address: address || '',
      phone: phone || '',
      email: email || '',
      description: description || '',
      deliveryFee: 2.99,
      deliveryTime: '20-30 min',
      logo: 'https://cdn-icons-png.flaticon.com/512/3132/3132693.png',
      menu: []
    }
  };
  
  // Add to restaurant owners array
  restaurantOwners.push(newOwner);
  localStorage.setItem('restaurantOwners', JSON.stringify(restaurantOwners));
  
  // Also store as current restaurant owner
  localStorage.setItem('currentRestaurantOwner', JSON.stringify(newOwner));
  
  // Set global variable
  currentRestaurantOwner = newOwner;
  
  // Show dashboard
  showRestaurantDashboard();
  
  // Display success message
  showToast('Restaurant account created successfully!');
}

// Logout restaurant owner
function logoutRestaurantOwner() {
  localStorage.removeItem('currentRestaurantOwner');
  currentRestaurantOwner = null;
  document.getElementById('restaurant-login-page').style.display = 'block';
  document.getElementById('restaurant-dashboard').style.display = 'none';
  
  // Clear fields
  document.getElementById('restaurant-username').value = '';
  document.getElementById('restaurant-password').value = '';
  
  showToast('Logged out successfully');
}

// Show restaurant dashboard
function showRestaurantDashboard() {
  document.getElementById('restaurant-login-page').style.display = 'none';
  document.getElementById('restaurant-dashboard').style.display = 'block';
  
  // Update restaurant name display
  const dashboardNameElem = document.getElementById('dashboard-restaurant-name');
  if (dashboardNameElem && currentRestaurantOwner) {
    dashboardNameElem.textContent = currentRestaurantOwner.restaurant.name;
  }
}

// Load restaurant data
function loadRestaurantData() {
  if (!currentRestaurantOwner) return;
  
  restaurantData = currentRestaurantOwner.restaurant;
  
  // Load profile data
  loadProfileData();
  
  // Load menu data
  loadMenuData();
  
  // Load orders
  loadRestaurantOrders();
}

// Load profile data into form
function loadProfileData() {
  if (!restaurantData) return;
  
  document.getElementById('profile-restaurant-name').value = restaurantData.name || '';
  document.getElementById('profile-cuisine').value = restaurantData.cuisine || '';
  document.getElementById('profile-address').value = restaurantData.address || '';
  document.getElementById('profile-phone').value = restaurantData.phone || '';
  document.getElementById('profile-email').value = restaurantData.email || '';
  document.getElementById('profile-description').value = restaurantData.description || '';
  document.getElementById('profile-delivery-fee').value = restaurantData.deliveryFee || 2.99;
  document.getElementById('profile-delivery-time').value = restaurantData.deliveryTime || '20-30 min';
  document.getElementById('profile-logo').value = restaurantData.logo || '';
}

// Save restaurant profile
function saveRestaurantProfile() {
  if (!currentRestaurantOwner) return;
  
  // Get updated values
  const name = document.getElementById('profile-restaurant-name').value.trim();
  const cuisine = document.getElementById('profile-cuisine').value;
  const address = document.getElementById('profile-address').value.trim();
  const phone = document.getElementById('profile-phone').value.trim();
  const email = document.getElementById('profile-email').value.trim();
  const description = document.getElementById('profile-description').value.trim();
  const deliveryFee = parseFloat(document.getElementById('profile-delivery-fee').value) || 2.99;
  const deliveryTime = document.getElementById('profile-delivery-time').value.trim();
  const logo = document.getElementById('profile-logo').value.trim();
  
  // Update restaurant data
  currentRestaurantOwner.restaurant = {
    ...currentRestaurantOwner.restaurant,
    name: name || 'My Restaurant',
    cuisine,
    address,
    phone,
    email,
    description,
    deliveryFee,
    deliveryTime: deliveryTime || '20-30 min',
    logo: logo || 'https://cdn-icons-png.flaticon.com/512/3132/3132693.png'
  };
  
  // Update restaurantData
  restaurantData = currentRestaurantOwner.restaurant;
  
  // Save to localStorage
  saveRestaurantOwnerData();
  
  // Update dashboard restaurant name
  const dashboardNameElem = document.getElementById('dashboard-restaurant-name');
  if (dashboardNameElem) {
    dashboardNameElem.textContent = name || 'My Restaurant';
  }
  
  showToast('Restaurant profile updated successfully');
}

// Load menu data
function loadMenuData() {
  if (!restaurantData) return;
  
  const menuCategoriesList = document.getElementById('menu-categories-list');
  if (!menuCategoriesList) return;
  
  // Check if menu is empty
  if (!restaurantData.menu || restaurantData.menu.length === 0) {
    menuCategoriesList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-utensils"></i>
        <p>No menu items yet</p>
        <p>Add items to your menu to get started</p>
      </div>
    `;
    return;
  }
  
  // Group menu items by category
  const menuByCategory = {};
  restaurantData.menu.forEach(item => {
    const category = item.category || 'Uncategorized';
    if (!menuByCategory[category]) {
      menuByCategory[category] = [];
    }
    menuByCategory[category].push(item);
  });
  
  // Generate HTML for each category
  let menuHTML = '';
  Object.keys(menuByCategory).forEach(category => {
    menuHTML += `
      <div class="menu-category-group">
        <h4>${category}</h4>
        <div class="menu-items">
    `;
    
    menuByCategory[category].forEach(item => {
      menuHTML += `
        <div class="menu-item" data-id="${item.id}">
          <div class="menu-item-info">
            <h4>${item.name}</h4>
            ${item.description ? `<p>${item.description}</p>` : ''}
            <span class="menu-item-price">$${item.price.toFixed(2)}</span>
          </div>
          <div class="menu-item-actions">
            <button class="edit" onclick="editMenuItem('${item.id}')">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button class="delete" onclick="deleteMenuItem('${item.id}')">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
      `;
    });
    
    menuHTML += `
        </div>
      </div>
    `;
  });
  
  menuCategoriesList.innerHTML = menuHTML;
}

// Show add item form
function showAddItemForm() {
  document.getElementById('add-item-form').style.display = 'block';
  document.getElementById('item-name').value = '';
  document.getElementById('item-description').value = '';
  document.getElementById('item-price').value = '';
  document.getElementById('item-category').value = 'Popular Items';
  document.getElementById('item-image').value = '';
}

// Cancel add item
function cancelAddItem() {
  document.getElementById('add-item-form').style.display = 'none';
}

// Save menu item
function saveMenuItem() {
  if (!currentRestaurantOwner) return;
  
  const name = document.getElementById('item-name').value.trim();
  const price = parseFloat(document.getElementById('item-price').value);
  
  if (!name || isNaN(price)) {
    showToast('Item name and price are required');
    return;
  }
  
  const description = document.getElementById('item-description').value.trim();
  const category = document.getElementById('item-category').value;
  const image = document.getElementById('item-image').value.trim();
  
  // Create new menu item
  const newItem = {
    id: Date.now().toString(),
    name,
    description,
    price,
    category,
    image: image || 'https://cdn-icons-png.flaticon.com/512/1404/1404945.png'
  };
  
  // Initialize menu array if needed
  if (!currentRestaurantOwner.restaurant.menu) {
    currentRestaurantOwner.restaurant.menu = [];
  }
  
  // Add new item
  currentRestaurantOwner.restaurant.menu.push(newItem);
  
  // Update restaurantData
  restaurantData = currentRestaurantOwner.restaurant;
  
  // Save to localStorage
  saveRestaurantOwnerData();
  
  // Hide form
  cancelAddItem();
  
  // Reload menu display
  loadMenuData();
  
  showToast('Menu item added successfully');
}

// Edit menu item
function editMenuItem(itemId) {
  if (!restaurantData || !restaurantData.menu) return;
  
  const item = restaurantData.menu.find(item => item.id === itemId);
  if (!item) return;
  
  // Show form with item data
  document.getElementById('add-item-form').style.display = 'block';
  document.getElementById('item-name').value = item.name;
  document.getElementById('item-description').value = item.description || '';
  document.getElementById('item-price').value = item.price;
  document.getElementById('item-category').value = item.category || 'Popular Items';
  document.getElementById('item-image').value = item.image || '';
  
  // Remove existing item
  deleteMenuItem(itemId, true);
}

// Delete menu item
function deleteMenuItem(itemId, skipConfirm = false) {
  if (!restaurantData || !restaurantData.menu) return;
  
  if (!skipConfirm) {
    if (!confirm('Are you sure you want to delete this menu item?')) {
      return;
    }
  }
  
  // Filter out the item to delete
  currentRestaurantOwner.restaurant.menu = restaurantData.menu.filter(item => item.id !== itemId);
  
  // Update restaurantData
  restaurantData = currentRestaurantOwner.restaurant;
  
  // Save to localStorage
  saveRestaurantOwnerData();
  
  // Reload menu display if not skipping confirmation (for edit)
  if (!skipConfirm) {
    loadMenuData();
    showToast('Menu item deleted successfully');
  }
}

// Show restaurant tab
function showRestaurantTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Remove active class from all tab buttons
  document.querySelectorAll('.tabs button').forEach(button => {
    button.classList.remove('active');
  });
  
  // Show selected tab
  const selectedTab = document.getElementById(tabName);
  if (selectedTab) {
    selectedTab.classList.add('active');
  }
  
  // Add active class to tab button
  const tabButton = document.getElementById(`${tabName}-tab`);
  if (tabButton) {
    tabButton.classList.add('active');
  }
}

// Filter restaurant orders
function filterRestaurantOrders(status) {
  document.querySelectorAll('.order-filters button').forEach(btn => {
    btn.classList.remove('active');
  });
  
  const selectedBtn = document.querySelector(`.order-filters button[onclick="filterRestaurantOrders('${status}')"]`);
  if (selectedBtn) {
    selectedBtn.classList.add('active');
  }
  
  loadRestaurantOrders(status);
}

// Load restaurant orders
function loadRestaurantOrders(filterStatus = 'all') {
  if (!currentRestaurantOwner) return;
  
  const ordersList = document.getElementById('restaurant-orders-list');
  if (!ordersList) return;
  
  // Get orders from localStorage
  const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
  
  // Filter orders for this restaurant
  const restaurantOrders = allOrders.filter(order => {
    return order.restaurantId === currentRestaurantOwner.id;
  });
  
  // Apply status filter if not 'all'
  const filteredOrders = filterStatus === 'all' 
    ? restaurantOrders 
    : restaurantOrders.filter(order => order.status === filterStatus);
  
  if (filteredOrders.length === 0) {
    ordersList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-clipboard-list"></i>
        <p>No ${filterStatus === 'all' ? '' : filterStatus} orders found</p>
      </div>
    `;
    return;
  }
  
  // Generate HTML for orders
  let ordersHTML = '';
  filteredOrders.forEach(order => {
    ordersHTML += `
      <div class="order-item">
        <div class="order-info">
          <h4>Order #${order.id}</h4>
          <p>Customer: ${order.customerName}</p>
          <p>Items: ${order.items.length}</p>
          <p>Total: $${order.total.toFixed(2)}</p>
        </div>
        <div class="order-actions">
          <span class="order-status status-${order.status}">${order.status}</span>
          <select onchange="updateOrderStatus('${order.id}', this.value)">
            <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
            <option value="preparing" ${order.status === 'preparing' ? 'selected' : ''}>Preparing</option>
            <option value="ready" ${order.status === 'ready' ? 'selected' : ''}>Ready</option>
            <option value="delivering" ${order.status === 'delivering' ? 'selected' : ''}>Delivering</option>
            <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
            <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </div>
      </div>
    `;
  });
  
  ordersList.innerHTML = ordersHTML;
}

// Update order status
function updateOrderStatus(orderId, newStatus) {
  // Get orders from localStorage
  const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
  
  // Find the order and update its status
  const orderIndex = allOrders.findIndex(order => order.id === orderId);
  if (orderIndex !== -1) {
    allOrders[orderIndex].status = newStatus;
    
    // Save back to localStorage
    localStorage.setItem('orders', JSON.stringify(allOrders));
    
    // Reload orders display
    loadRestaurantOrders(document.querySelector('.order-filters button.active').textContent.toLowerCase());
    
    showToast(`Order #${orderId} status updated to ${newStatus}`);
  }
}

// Save restaurant owner data
function saveRestaurantOwnerData() {
  if (!currentRestaurantOwner) return;
  
  // Get all restaurant owners
  const restaurantOwners = JSON.parse(localStorage.getItem('restaurantOwners') || '[]');
  
  // Find and update the current owner
  const ownerIndex = restaurantOwners.findIndex(owner => owner.id === currentRestaurantOwner.id);
  if (ownerIndex !== -1) {
    restaurantOwners[ownerIndex] = currentRestaurantOwner;
  }
  
  // Save back to localStorage
  localStorage.setItem('restaurantOwners', JSON.stringify(restaurantOwners));
  localStorage.setItem('currentRestaurantOwner', JSON.stringify(currentRestaurantOwner));
}

// Show toast message
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

// Make functions globally available
window.showLoginTab = showLoginTab;
window.showSignupTab = showSignupTab;
window.loginRestaurantOwner = loginRestaurantOwner;
window.registerRestaurantOwner = registerRestaurantOwner;
window.logoutRestaurantOwner = logoutRestaurantOwner;
window.showRestaurantTab = showRestaurantTab;
window.filterRestaurantOrders = filterRestaurantOrders;
window.showAddItemForm = showAddItemForm;
window.cancelAddItem = cancelAddItem;
window.saveMenuItem = saveMenuItem;
window.editMenuItem = editMenuItem;
window.deleteMenuItem = deleteMenuItem;
window.saveRestaurantProfile = saveRestaurantProfile;
window.updateOrderStatus = updateOrderStatus;
window.toggleDarkMode = toggleDarkMode; 