// دالة للتحقق من صلاحية التوكن
export const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiryTime = payload.exp * 1000; // تحويل إلى ميلي ثانية
    return Date.now() < expiryTime;
  } catch (error) {
    return false;
  }
};

// دالة لتحديث التوكن
export const refreshToken = async () => {
  const token = localStorage.getItem('user_token');
  if (!token) return null;

  try {
    const response = await fetch('http://localhost:8000/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('user_token', data.token);
      return data.token;
    }
    return null;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};

// دالة لإضافة CSRF token للطلبات
export const addCsrfToken = (headers = {}) => {
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
  if (csrfToken) {
    return {
      ...headers,
      'X-CSRF-Token': csrfToken
    };
  }
  return headers;
};

// دالة للتحقق من صلاحية المستخدم
export const checkAuth = async () => {
  const token = localStorage.getItem('user_token');
  
  if (!token) {
    return false;
  }

  if (!isTokenValid(token)) {
    const newToken = await refreshToken();
    if (!newToken) {
      localStorage.removeItem('user_token');
      return false;
    }
  }

  return true;
};

// دالة لإضافة headers الأمان للطلبات
export const getSecureHeaders = () => {
  const token = localStorage.getItem('user_token');
  const headers = {
    'Content-Type': 'application/json',
    ...addCsrfToken()
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}; 