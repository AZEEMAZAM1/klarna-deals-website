// Firebase Authentication Module
// Handles user authentication (signup, login, logout, password reset)

// Wait for Firebase to be initialized
window.addEventListener('load', () => {
  const auth = window.firebaseAuth;
  const db = window.firebaseDB;

  // Check authentication state
  auth.onAuthStateChanged((user) => {
    if (user) {
      // User is signed in
      console.log('User logged in:', user.email);
      updateUIForLoggedInUser(user);
    } else {
      // User is signed out
      console.log('No user logged in');
      updateUIForLoggedOutUser();
    }
  });
});

// Sign up new user
async function signUpUser(email, password, displayName) {
  try {
    const userCredential = await window.firebaseAuth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Update user profile
    await user.updateProfile({
      displayName: displayName
    });

    // Create user document in Firestore
    await window.firebaseDB.collection('users').doc(user.uid).set({
      displayName: displayName,
      email: email,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      cart: [],
      orders: []
    });

    console.log('User signed up successfully:', user.email);
    showToast('Account created successfully! Welcome!', 'success');
    return user;
  } catch (error) {
    console.error('Sign up error:', error);
    showToast(getErrorMessage(error.code), 'error');
    throw error;
  }
}

// Sign in existing user
async function signInUser(email, password) {
  try {
    const userCredential = await window.firebaseAuth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    console.log('User signed in:', user.email);
    showToast('Welcome back!', 'success');
    return user;
  } catch (error) {
    console.error('Sign in error:', error);
    showToast(getErrorMessage(error.code), 'error');
    throw error;
  }
}

// Sign out current user
async function signOutUser() {
  try {
    await window.firebaseAuth.signOut();
    console.log('User signed out');
    showToast('Signed out successfully', 'success');
    // Clear cart from localStorage
    localStorage.removeItem('cart');
  } catch (error) {
    console.error('Sign out error:', error);
    showToast('Error signing out', 'error');
  }
}

// Reset password
async function resetPassword(email) {
  try {
    await window.firebaseAuth.sendPasswordResetEmail(email);
    showToast('Password reset email sent! Check your inbox.', 'success');
  } catch (error) {
    console.error('Password reset error:', error);
    showToast(getErrorMessage(error.code), 'error');
  }
}

// Update UI for logged in user
function updateUIForLoggedInUser(user) {
  const authButtons = document.querySelector('.auth-buttons');
  if (authButtons) {
    authButtons.innerHTML = `
      <span>Welcome, ${user.displayName || user.email}!</span>
      <button onclick="signOutUser()" class="auth-btn">Sign Out</button>
    `;
  }

  // Show user-specific features
  document.querySelectorAll('.requires-auth').forEach(el => {
    el.style.display = 'block';
  });
}

// Update UI for logged out user
function updateUIForLoggedOutUser() {
  const authButtons = document.querySelector('.auth-buttons');
  if (authButtons) {
    authButtons.innerHTML = `
      <button onclick="showLoginModal()" class="auth-btn">Sign In</button>
      <button onclick="showSignupModal()" class="auth-btn">Sign Up</button>
    `;
  }

  // Hide user-specific features
  document.querySelectorAll('.requires-auth').forEach(el => {
    el.style.display = 'none';
  });
}

// Show login modal
function showLoginModal() {
  const modal = document.createElement('div');
  modal.className = 'auth-modal';
  modal.innerHTML = `
    <div class="auth-modal-content">
      <span class="close-modal" onclick="this.closest('.auth-modal').remove()">&times;</span>
      <h2>Sign In</h2>
      <form id="loginForm">
        <input type="email" id="loginEmail" placeholder="Email" required>
        <input type="password" id="loginPassword" placeholder="Password" required>
        <button type="submit">Sign In</button>
      </form>
      <p><a href="#" onclick="showResetPasswordModal(); return false;">Forgot Password?</a></p>
      <p>Don't have an account? <a href="#" onclick="showSignupModal(); return false;">Sign Up</a></p>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    await signInUser(email, password);
    modal.remove();
  });
}

// Show signup modal
function showSignupModal() {
  const modal = document.createElement('div');
  modal.className = 'auth-modal';
  modal.innerHTML = `
    <div class="auth-modal-content">
      <span class="close-modal" onclick="this.closest('.auth-modal').remove()">&times;</span>
      <h2>Create Account</h2>
      <form id="signupForm">
        <input type="text" id="signupName" placeholder="Full Name" required>
        <input type="email" id="signupEmail" placeholder="Email" required>
        <input type="password" id="signupPassword" placeholder="Password (min 6 characters)" minlength="6" required>
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <a href="#" onclick="showLoginModal(); return false;">Sign In</a></p>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    await signUpUser(email, password, name);
    modal.remove();
  });
}

// Show reset password modal
function showResetPasswordModal() {
  document.querySelectorAll('.auth-modal').forEach(m => m.remove());
  
  const modal = document.createElement('div');
  modal.className = 'auth-modal';
  modal.innerHTML = `
    <div class="auth-modal-content">
      <span class="close-modal" onclick="this.closest('.auth-modal').remove()">&times;</span>
      <h2>Reset Password</h2>
      <form id="resetForm">
        <input type="email" id="resetEmail" placeholder="Email" required>
        <button type="submit">Send Reset Email</button>
      </form>
      <p><a href="#" onclick="showLoginModal(); return false;">Back to Sign In</a></p>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('resetForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('resetEmail').value;
    await resetPassword(email);
    modal.remove();
  });
}

// Get user-friendly error messages
function getErrorMessage(errorCode) {
  const errorMessages = {
    'auth/email-already-in-use': 'This email is already registered',
    'auth/invalid-email': 'Invalid email address',
    'auth/weak-password': 'Password should be at least 6 characters',
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/too-many-requests': 'Too many failed attempts. Try again later'
  };
  return errorMessages[errorCode] || 'An error occurred. Please try again.';
}

// Export functions
window.signUpUser = signUpUser;
window.signInUser = signInUser;
window.signOutUser = signOutUser;
window.resetPassword = resetPassword;
window.showLoginModal = showLoginModal;
window.showSignupModal = showSignupModal;
window.showResetPasswordModal = showResetPasswordModal;
