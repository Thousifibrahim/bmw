document.addEventListener('DOMContentLoaded', () => {
  const fallbackCars = [
    {
      model: "BMW i4 xDrive40",
      description: "Dual‑motor AWD, 396 hp, ~287 mi range",
      price: 62300,
      currency: "USD",
      discounted_price: 60500,
      discount_available: true,
      details_url: "https://www.bmwusa.com/i4-xdrive40",
      image_url: "https://www.bmwusa.com/content/dam/bmwusa/i4-overview/BMW-i4-xDrive40.jpg"
    },
    {
      model: "BMW iX xDrive50",
      description: "Luxury SUV, dual‑motor AWD, ~516 hp, ~377 mi range",
      price: 87250,
      currency: "USD",
      discounted_price: 85000,
      discount_available: true,
      details_url: "https://www.bmwusa.com/vehicles/all-electric/ix/suv/overview.html",
      image_url: "https://www.bmwusa.com/content/dam/bmwusa/iX/2025/04/BMW-IX-Overview-01.jpg"
    }
  ];

  const getCart = () => JSON.parse(localStorage.getItem('cart')) || [];

  // Simple hash function for demo purposes (not secure for production)
  const simpleHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  };

  // User Management
  const getUsers = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    console.log('Retrieved users:', users);
    return users;
  };
  const saveUsers = (users) => {
    localStorage.setItem('users', JSON.stringify(users));
    console.log('Saved users:', users);
  };

  const updateLoginStatus = () => {
    const userMenu = document.getElementById('user-menu');
    if (!userMenu) return;

    const user = localStorage.getItem('user');
    if (user) {
      userMenu.innerHTML = `
       <a href="#" class="user-icon"><i class="fas fa-user"></i></a>
        <div class="dropdown-content user-dropdown">
          <span class="username">${user}</span>
          <a href="#" id="logout-link">Logout</a>
        </div>
      `;
      const logoutLink = document.getElementById('logout-link');
      if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
          e.preventDefault();
          localStorage.removeItem('user');
          updateLoginStatus();
          window.location.reload(); // Refresh to update nav
        });
      }
    } else {
      userMenu.innerHTML = `
        <a href="#" class="user-icon"><i class="fas fa-user"></i></a>
        <div class="dropdown-content user-dropdown">
          <a href="#" id="login-link">Login</a>
          <a href="../userreg/signup.html" id="register-link">Register</a>
        </div>
      `;
      const loginLink = document.getElementById('login-link');
      if (loginLink) {
        loginLink.addEventListener('click', (e) => {
          e.preventDefault();
          document.getElementById('login-modal').style.display = 'block';
        });
      }
    }
  };

  const updateCartCount = () => {
    const cart = getCart();
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) cartCount.textContent = cart.length;
  };

  const populateCarGrid = (cars) => {
    const carGrid = document.getElementById('car-grid');
    if (!carGrid) return;
    carGrid.innerHTML = '';
    cars.forEach(car => {
      const item = document.createElement('div');
      item.className = 'option-card';
      item.innerHTML = `
        <img src="${car.image_url}" alt="${car.model}">
        <div class="card-content">
          <h3>${car.model}</h3>
          <p>${car.description}</p>
          <p class="price">
            ${car.discount_available ? `<del>${car.currency} ${car.price.toLocaleString()}</del> ${car.currency} ${car.discounted_price.toLocaleString()}` : `${car.currency} ${car.price.toLocaleString()}`}
          </p>
          <a href="${car.details_url}" class="option-btn">Know More</a>
        </div>
      `;
      carGrid.appendChild(item);
    });
  };

  if (document.getElementById('car-grid')) {
    fetch('../json/electric.json')
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then(electricCars => {
        if (!Array.isArray(electricCars)) throw new Error('Invalid JSON data');
        populateCarGrid(electricCars);
      })
      .catch(error => {
        console.error('Error fetching electric.json:', error.message);
        alert('Failed to load cars. Showing sample models.');
        populateCarGrid(fallbackCars);
      });
  }

  // Modal Handling
  const loginModal = document.getElementById('login-modal');
  const loginClose = loginModal?.getElementsByClassName('close')[0];
  if (loginModal && loginClose) {
    loginClose.addEventListener('click', () => { loginModal.style.display = 'none'; });
    window.addEventListener('click', event => {
      if (event.target === loginModal) {
        loginModal.style.display = 'none';
      }
    });
  }

  // Show Login Modal Link
  const showLoginModalLinks = document.querySelectorAll('#show-login-modal');
  showLoginModalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      loginModal.style.display = 'block';
    });
  });

  // Registration Form Handling
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('username')?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const password = document.getElementById('password')?.value;

      console.log('Register attempt:', { username, email });

      if (!username || !email || !password) {
        alert('Please fill in all fields.');
        return;
      }

      const users = getUsers();
      if (users.find(user => user.username === username)) {
        alert('Username already exists. Please choose another.');
        return;
      }
      if (users.find(user => user.email === email)) {
        alert('Email already registered. Please use another.');
        return;
      }

      users.push({
        username,
        email,
        password: simpleHash(password)
      });
      saveUsers(users);
      alert('Sign up successful! Please login.');
      loginModal.style.display = 'block';
    });
  }

  // Login Form Handling
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('username')?.value.trim();
      const password = document.getElementById('password')?.value;

      console.log('Login attempt:', { username });

      if (!username || !password) {
        alert('Please enter a valid username and password.');
        return;
      }

      const users = getUsers();
      const user = users.find(user => user.username === username && user.password === simpleHash(password));
      if (user) {
        localStorage.setItem('user', username);
        console.log('Login successful for user:', username);
        alert('Login successful!');
        window.parent.postMessage('login-success', '*');
      } else {
        console.log('Login failed: Invalid credentials');
        alert('Invalid username or password.');
      }
    });
  }

  // Handle login-success message from iframe
  window.addEventListener('message', (event) => {
    if (event.data === 'login-success') {
      console.log('Received login-success message');
      if (loginModal) loginModal.style.display = 'none';
      updateLoginStatus();
      window.location.reload(); // Refresh page after login
    }
  });

  const testDriveModal = document.getElementById('test-drive-modal');
  const testDriveBtn = document.getElementById('test-drive-btn');
  const testDriveClose = testDriveModal?.getElementsByClassName('close')[0];
  const testDriveForm = document.getElementById('test-drive-form');

  if (testDriveBtn && testDriveModal && testDriveClose && testDriveForm) {
    testDriveBtn.addEventListener('click', () => { testDriveModal.style.display = 'block'; });
    testDriveClose.addEventListener('click', () => { testDriveModal.style.display = 'none'; });
    window.addEventListener('click', event => {
      if (event.target === testDriveModal) {
        testDriveModal.style.display = 'none';
      }
    });
    testDriveForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('name')?.value;
      const email = document.getElementById('email')?.value;
      const model = document.getElementById('model')?.value;
      if (name && email && model) {
        alert(`Thank you, ${name}! Your test drive request for ${model} has been submitted.`);
        testDriveModal.style.display = 'none';
        testDriveForm.reset();
      }
    });
  }

  const contactDealerModal = document.getElementById('contact-dealer-modal');
  const contactDealerClose = contactDealerModal?.getElementsByClassName('close')[0];
  const contactDealerForm = document.getElementById('contact-dealer-form');

  if (contactDealerModal && contactDealerClose && contactDealerForm) {
    contactDealerClose.addEventListener('click', () => { contactDealerModal.style.display = 'none'; });
    window.addEventListener('click', event => {
      if (event.target === contactDealerModal) {
        contactDealerModal.style.display = 'none';
      }
    });
    contactDealerForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('dealer-name')?.value;
      const email = document.getElementById('dealer-email')?.value;
      const model = document.getElementById('dealer-model')?.value;
      if (name && email && model) {
        alert(`Thank you, ${name}! Your dealer inquiry for ${model} has been sent.`);
        contactDealerModal.style.display = 'none';
        contactDealerForm.reset();
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  updateLoginStatus();
  updateCartCount();
});