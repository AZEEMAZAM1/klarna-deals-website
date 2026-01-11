// Firebase Products Management

// Add a new product to Firebase
async function addProduct(productData) {
  try {
    const product = {
      id: db.collection('products').doc().id,
      name: productData.name,
      description: productData.description,
      price: parseFloat(productData.price),
      originalPrice: parseFloat(productData.originalPrice || productData.price),
      discount: productData.discount || 0,
      image: productData.image || 'https://via.placeholder.com/300',
      category: productData.category || 'general',
      stock: parseInt(productData.stock || 0),
      klarnaAvailable: productData.klarnaAvailable !== false,
      featured: productData.featured || false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('products').doc(product.id).set(product);
    console.log('Product added successfully:', product.id);
    return product;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
}

// Get all products
async function getAllProducts() {
  try {
    const snapshot = await db.collection('products')
      .orderBy('createdAt', 'desc')
      .get();

    const products = [];
    snapshot.forEach(doc => {
      products.push({ id: doc.id, ...doc.data() });
    });

    return products;
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
}

// Get featured products
async function getFeaturedProducts() {
  try {
    const snapshot = await db.collection('products')
      .where('featured', '==', true)
      .limit(6)
      .get();

    const products = [];
    snapshot.forEach(doc => {
      products.push({ id: doc.id, ...doc.data() });
    });

    return products;
  } catch (error) {
    console.error('Error getting featured products:', error);
    throw error;
  }
}

// Get products by category
async function getProductsByCategory(category) {
  try {
    const snapshot = await db.collection('products')
      .where('category', '==', category)
      .get();

    const products = [];
    snapshot.forEach(doc => {
      products.push({ id: doc.id, ...doc.data() });
    });

    return products;
  } catch (error) {
    console.error('Error getting products by category:', error);
    throw error;
  }
}

// Get single product by ID
async function getProductById(productId) {
  try {
    const doc = await db.collection('products').doc(productId).get();
    
    if (!doc.exists) {
      throw new Error('Product not found');
    }

    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
}

// Update product
async function updateProduct(productId, updates) {
  try {
    updates.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
    
    await db.collection('products').doc(productId).update(updates);
    console.log('Product updated successfully');
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

// Delete product
async function deleteProduct(productId) {
  try {
    await db.collection('products').doc(productId).delete();
    console.log('Product deleted successfully');
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

// Search products
async function searchProducts(searchTerm) {
  try {
    const snapshot = await db.collection('products').get();
    
    const products = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      const searchLower = searchTerm.toLowerCase();
      
      if (data.name.toLowerCase().includes(searchLower) || 
          data.description.toLowerCase().includes(searchLower) ||
          data.category.toLowerCase().includes(searchLower)) {
        products.push({ id: doc.id, ...data });
      }
    });

    return products;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
}

// Update product stock
async function updateProductStock(productId, quantity) {
  try {
    const productRef = db.collection('products').doc(productId);
    const product = await productRef.get();
    
    if (!product.exists) {
      throw new Error('Product not found');
    }

    const currentStock = product.data().stock || 0;
    const newStock = currentStock + quantity;

    if (newStock < 0) {
      throw new Error('Insufficient stock');
    }

    await productRef.update({
      stock: newStock,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    console.log('Stock updated successfully');
  } catch (error) {
    console.error('Error updating stock:', error);
    throw error;
  }
}
