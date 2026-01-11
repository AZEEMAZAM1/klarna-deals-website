// Firebase Firestore Database Module
// Handles cart, orders, and products data synchronization

// Save cart to Firestore
async function saveCartToFirestore(userId, cartItems) {
  try {
    await window.firebaseDB.collection('users').doc(userId).update({
      cart: cartItems,
      lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
    });
    console.log('Cart saved to Firestore');
  } catch (error) {
    console.error('Error saving cart:', error);
  }
}

// Load cart from Firestore
async function loadCartFromFirestore(userId) {
  try {
    const doc = await window.firebaseDB.collection('users').doc(userId).get();
    if (doc.exists) {
      const data = doc.data();
      return data.cart || [];
    }
    return [];
  } catch (error) {
    console.error('Error loading cart:', error);
    return [];
  }
}

// Add product to cart (Firebase version)
async function addToCartFirebase(productName, price, image, description = '') {
  const user = window.firebaseAuth.currentUser;
  
  if (!user) {
    showToast('Please sign in to add items to cart', 'error');
    showLoginModal();
    return;
  }

  try {
    let cart = await loadCartFromFirestore(user.uid);
    
    const existingItemIndex = cart.findIndex(item => item.name === productName);
    
    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity++;
    } else {
      cart.push({
        name: productName,
        price: price,
        image: image || 'https://via.placeholder.com/100',
        description: description,
        quantity: 1,
        addedAt: new Date().toISOString()
      });
    }
    
    await saveCartToFirestore(user.uid, cart);
    updateCartCountFromFirestore();
    showToast(`${productName} added to cart!`, 'success');
    
    // Track analytics
    window.firebaseAnalytics.logEvent('add_to_cart', {
      item_name: productName,
      price: price
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    showToast('Error adding to cart', 'error');
  }
}

// Update cart count from Firestore
async function updateCartCountFromFirestore() {
  const user = window.firebaseAuth.currentUser;
  
  if (!user) {
    const cartCountElements = document.querySelectorAll('#cart-count');
    cartCountElements.forEach(el => el.textContent = '0');
    return;
  }

  try {
    const cart = await loadCartFromFirestore(user.uid);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('#cart-count');
    cartCountElements.forEach(el => el.textContent = totalItems);
  } catch (error) {
    console.error('Error updating cart count:', error);
  }
}

// Create order in Firestore
async function createOrder(cartItems, totalAmount) {
  const user = window.firebaseAuth.currentUser;
  
  if (!user) {
    showToast('Please sign in to create an order', 'error');
    return null;
  }

  try {
    const order = {
      userId: user.uid,
      userEmail: user.email,
      items: cartItems,
      totalAmount: totalAmount,
      status: 'pending',
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      paymentMethod: 'klarna'
    };

    const docRef = await window.firebaseDB.collection('orders').add(order);
    
    // Clear user's cart
    await saveCartToFirestore(user.uid, []);
    
    // Track analytics
    window.firebaseAnalytics.logEvent('purchase', {
      transaction_id: docRef.id,
      value: totalAmount,
      currency: 'GBP'
    });
    
    console.log('Order created:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    showToast('Error creating order', 'error');
    return null;
  }
}

// Get user's orders
async function getUserOrders(userId) {
  try {
    const ordersSnapshot = await window.firebaseDB
      .collection('orders')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    
    const orders = [];
    ordersSnapshot.forEach(doc => {
      orders.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return orders;
  } catch (error) {
    console.error('Error getting orders:', error);
    return [];
  }
}

// Save email subscription to Firestore
async function saveEmailSubscription(email) {
  try {
    await window.firebaseDB.collection('emailSubscriptions').add({
      email: email,
      subscribedAt: firebase.firestore.FieldValue.serverTimestamp(),
      active: true
    });
    
    // Track analytics
    window.firebaseAnalytics.logEvent('newsletter_signup', {
      email: email
    });
    
    console.log('Email subscription saved');
    return true;
  } catch (error) {
    console.error('Error saving subscription:', error);
    return false;
  }
}

// Track page views
function trackPageView(pageName) {
  if (window.firebaseAnalytics) {
    window.firebaseAnalytics.logEvent('page_view', {
      page_title: pageName,
      page_location: window.location.href
    });
  }
}

// Initialize real-time cart listener
function initCartListener() {
  const user = window.firebaseAuth.currentUser;
  
  if (!user) return;

  window.firebaseDB.collection('users').doc(user.uid)
    .onSnapshot(doc => {
      if (doc.exists) {
        const data = doc.data();
        const cart = data.cart || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountElements = document.querySelectorAll('#cart-count');
        cartCountElements.forEach(el => el.textContent = totalItems);
      }
    });
}

// Export functions
window.saveCartToFirestore = saveCartToFirestore;
window.loadCartFromFirestore = loadCartFromFirestore;
window.addToCartFirebase = addToCartFirebase;
window.updateCartCountFromFirestore = updateCartCountFromFirestore;
window.createOrder = createOrder;
window.getUserOrders = getUserOrders;
window.saveEmailSubscription = saveEmailSubscription;
window.trackPageView = trackPageView;
window.initCartListener = initCartListener;

// Initialize on load
window.addEventListener('load', () => {
  window.firebaseAuth.onAuthStateChanged(user => {
    if (user) {
      initCartListener();
      updateCartCountFromFirestore();
    }
  });
  
  // Track page view
  trackPageView(document.title);
});
