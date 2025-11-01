// Simple database utility using localStorage (SQLite-compatible structure)

// Initialize database and create dummy user
export const initDatabase = () => {
  // Check if database is already initialized
  if (localStorage.getItem('ilara_db_initialized')) {
    return;
  }
  
  // Create users table structure in localStorage
  const users = [
    {
      id: 1,
      name: 'Shyam Baranwal',
      email: 'shyam@ilara.com',
      password: 'Radhe@',
      phone: '+91-1234567890',
      address: '123 Main Street',
      city: 'Mumbai',
      country: 'India',
      zip: '400001',
      created_at: new Date().toISOString(),
    }
  ];
  
  localStorage.setItem('ilara_users', JSON.stringify(users));
  localStorage.setItem('ilara_db_initialized', 'true');
};

// Authenticate user
export const authenticateUser = (email, password) => {
  try {
    initDatabase();
    
    const users = JSON.parse(localStorage.getItem('ilara_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Remove password from user object before returning
      const { password: _, ...userWithoutPassword } = user;
      return { success: true, user: userWithoutPassword };
    }
    
    return { success: false, message: 'Invalid email or password' };
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, message: 'Authentication failed' };
  }
};

// Register new user
export const registerUser = (userData) => {
  try {
    initDatabase();
    
    const users = JSON.parse(localStorage.getItem('ilara_users') || '[]');
    
    // Check if email already exists
    if (users.find(u => u.email === userData.email)) {
      return { success: false, message: 'Email already registered' };
    }
    
    // Generate new ID
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    
    // Create new user
    const newUser = {
      id: newId,
      name: userData.clientName,
      email: userData.email,
      password: userData.password,
      phone: userData.phone || '',
      address: userData.address || '',
      city: userData.city || '',
      country: userData.country || '',
      zip: userData.zip || '',
      created_at: new Date().toISOString(),
    };
    
    users.push(newUser);
    localStorage.setItem('ilara_users', JSON.stringify(users));
    
    // Remove password from returned user
    const { password: _, ...userWithoutPassword } = newUser;
    return { success: true, message: 'User registered successfully', user: userWithoutPassword };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: 'Registration failed' };
  }
};

// Save current user session
export const saveUserSession = (user) => {
  localStorage.setItem('ilara_current_user', JSON.stringify(user));
};

// Get current user session
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('ilara_current_user');
  return userStr ? JSON.parse(userStr) : null;
};

// Clear user session
export const clearUserSession = () => {
  localStorage.removeItem('ilara_current_user');
};
