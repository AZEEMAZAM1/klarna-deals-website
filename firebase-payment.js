// Firebase Payment Methods Management

// Add payment method to user profile
async function addPaymentMethod(paymentData) {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be logged in to add payment methods');
    }

    const paymentMethod = {
      id: db.collection('users').doc().id,
      userId: user.uid,
      cardholderName: paymentData.cardholderName,
      cardNumber: paymentData.cardNumber.slice(-4), // Store only last 4 digits
      cardType: detectCardType(paymentData.cardNumber),
      expiryMonth: paymentData.expiryMonth,
      expiryYear: paymentData.expiryYear,
      isDefault: paymentData.isDefault || false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('users').doc(user.uid)
      .collection('paymentMethods').doc(paymentMethod.id).set(paymentMethod);

    console.log('Payment method added successfully');
    return paymentMethod;
  } catch (error) {
    console.error('Error adding payment method:', error);
    throw error;
  }
}

// Detect card type from card number
function detectCardType(cardNumber) {
  const patterns = {
    visa: /^4/,
    mastercard: /^5[1-5]/,
    amex: /^3[47]/,
    discover: /^6(?:011|5)/
  };

  for (let [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(cardNumber)) {
      return type;
    }
  }
  return 'unknown';
}

// Get all payment methods for current user
async function getPaymentMethods() {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be logged in');
    }

    const snapshot = await db.collection('users').doc(user.uid)
      .collection('paymentMethods')
      .orderBy('createdAt', 'desc')
      .get();

    const paymentMethods = [];
    snapshot.forEach(doc => {
      paymentMethods.push({ id: doc.id, ...doc.data() });
    });

    return paymentMethods;
  } catch (error) {
    console.error('Error getting payment methods:', error);
    throw error;
  }
}

// Delete payment method
async function deletePaymentMethod(paymentMethodId) {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be logged in');
    }

    await db.collection('users').doc(user.uid)
      .collection('paymentMethods').doc(paymentMethodId).delete();

    console.log('Payment method deleted successfully');
  } catch (error) {
    console.error('Error deleting payment method:', error);
    throw error;
  }
}

// Set default payment method
async function setDefaultPaymentMethod(paymentMethodId) {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be logged in');
    }

    const batch = db.batch();

    // Set all payment methods to non-default
    const snapshot = await db.collection('users').doc(user.uid)
      .collection('paymentMethods').get();
    
    snapshot.forEach(doc => {
      batch.update(doc.ref, { isDefault: false });
    });

    // Set selected payment method as default
    const paymentMethodRef = db.collection('users').doc(user.uid)
      .collection('paymentMethods').doc(paymentMethodId);
    batch.update(paymentMethodRef, { isDefault: true });

    await batch.commit();
    console.log('Default payment method updated');
  } catch (error) {
    console.error('Error setting default payment method:', error);
    throw error;
  }
}
