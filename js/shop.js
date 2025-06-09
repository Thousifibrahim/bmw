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
  const saveCart = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    if (document.getElementById('cart-items')) populateCartItems();
  };

  const updateCartCount = () => {
    const cart = getCart();
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) cartCount.textContent = cart.length;
  };

  const addToCart = (car) => {
    const cart = getCart();
    if (cart.length >= 3 && !cart.find(item => item.model === car.model && item.currency === car.currency)) {
      alert('Cart limit reached (3 items). Remove an item to add another.');
      return;
    }
    const existingItem = cart.find(item => item.model === car.model && item.currency === car.currency);
    if (existingItem) {
      existingItem.quantity = Math.min(existingItem.quantity + 1, 10);
    } else {
      cart.push({ ...car, quantity: 1 });
    }
    saveCart(cart);
    alert(`${car.model} added to cart!`);
  };

  const updateQuantity = (model, currency, newQuantity) => {
    const cart = getCart();
    const item = cart.find(i => i.model === model && i.currency === currency);
    if (item) {
      item.quantity = Math.max(1, Math.min(newQuantity, 10));
      saveCart(cart);
    }
  };

  const removeFromCart = (model, currency) => {
    const cart = getCart().filter(item => !(item.model === model && item.currency === currency));
    saveCart(cart);
  };

  const clearCart = () => {
    saveCart([]);
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
          window.location.reload();
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

  const populateShopGrid = (cars) => {
    const carGrid = document.getElementById('car-grid');
    if (!carGrid) return;
    carGrid.innerHTML = '';
    cars.forEach(car => {
      const card = document.createElement('div');
      card.className = 'option-card';
      card.innerHTML = `
        <img src="${car.image_url}" alt="${car.model}">
        <div class="card-content">
          <h3>${car.model}</h3>
          <p>${car.description}</p>
          <p class="price">
            ${car.discount_available ? `<del>${car.currency} ${car.price.toLocaleString()}</del> ${car.currency} ${car.discounted_price.toLocaleString()}` : `${car.currency} ${car.price.toLocaleString()}`}
          </p>
          <button class="option-btn" data-model="${car.model}" data-currency="${car.currency}">Buy Now</button>
        </div>
      `;
      carGrid.appendChild(card);
    });

    document.querySelectorAll('.option-btn').forEach(button => {
      button.addEventListener('click', () => {
        const model = button.dataset.model;
        const currency = button.dataset.currency;
        const car = cars.find(c => c.model === model && c.currency === currency);
        if (car) addToCart(car);
      });
    });
  };

  const populateCartItems = () => {
    const cartItems = document.getElementById('cart-items');
    const totalAmountSpan = document.getElementById('cart-total-amount');
    const itemCountSpan = document.getElementById('cart-item-count');
    if (!cartItems || !totalAmountSpan || !itemCountSpan) return;

    const cart = getCart();
    cartItems.innerHTML = '';
    let total = 0;
    let itemCount = cart.length;

    if (cart.length === 0) {
      cartItems.innerHTML = '<p>Your cart is empty. <a href="../shop/shop.html">Shop now</a>.</p>';
      totalAmountSpan.textContent = 'USD 0';
      itemCountSpan.textContent = '0';
      return;
    }

    cart.forEach(item => {
      const price = item.discount_available ? item.discounted_price : item.price;
      const itemTotal = price * item.quantity;
      total += itemTotal;

      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <img src="${item.image_url}" alt="${item.model}">
        <div class="cart-item-details">
          <h4>${item.model}</h4>
          <p>${item.description}</p>
          <p class="price">
            ${item.discount_available ? `<del>${item.currency} ${item.price.toLocaleString()}</del> ${item.currency} ${item.discounted_price.toLocaleString()}` : `${item.currency} ${item.price.toLocaleString()}`}
          </p>
          <div class="quantity-controls">
            <button class="decrease" data-model="${item.model}" data-currency="${item.currency}">-</button>
            <input type="number" value="${item.quantity}" min="1" max="10" data-model="${item.model}" data-currency="${item.currency}">
            <button class="increase" data-model="${item.model}" data-currency="${item.currency}">+</button>
          </div>
        </div>
        <button class="remove-item" data-model="${item.model}" data-currency="${item.currency}">Remove</button>
      `;
      cartItems.appendChild(cartItem);
    });

    totalAmountSpan.textContent = `USD ${total.toLocaleString()}`;
    itemCountSpan.textContent = itemCount;

    document.querySelectorAll('.increase').forEach(button => {
      button.addEventListener('click', () => {
        const model = button.dataset.model;
        const currency = button.dataset.currency;
        const input = button.previousElementSibling;
        updateQuantity(model, currency, parseInt(input.value) + 1);
      });
    });

    document.querySelectorAll('.decrease').forEach(button => {
      button.addEventListener('click', () => {
        const model = button.dataset.model;
        const currency = button.dataset.currency;
        const input = button.nextElementSibling;
        updateQuantity(model, currency, parseInt(input.value) - 1);
      });
    });

    document.querySelectorAll('.quantity-controls input').forEach(input => {
      input.addEventListener('change', () => {
        const model = input.dataset.model;
        const currency = input.dataset.currency;
        updateQuantity(model, currency, parseInt(input.value));
      });
    });

    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', () => {
        const model = button.dataset.model;
        const currency = button.dataset.currency;
        removeFromCart(model, currency);
      });
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
        populateShopGrid(electricCars);
      })
      .catch(error => {
        console.error('Error fetching ../json/electric.json:', error.message);
        alert('Failed to load cars. Showing sample models.');
        populateShopGrid(fallbackCars);
      });
  }

  if (document.getElementById('cart-items')) {
    populateCartItems();
    const clearCartBtn = document.getElementById('clear-cart');
    if (clearCartBtn) clearCartBtn.addEventListener('click', clearCart);
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

  const transactionModal = document.getElementById('transaction-modal');
  const transactionClose = transactionModal?.getElementsByClassName('close')[0];
  const confirmTransactionBtn = document.getElementById('confirm-transaction');
  if (transactionModal && transactionClose && confirmTransactionBtn) {
    transactionClose.addEventListener('click', () => { transactionModal.style.display = 'none'; });
    window.addEventListener('click', event => {
      if (event.target === transactionModal) {
        transactionModal.style.display = 'none';
      }
    });
    confirmTransactionBtn.addEventListener('click', () => {
      clearCart();
      transactionModal.style.display = 'none';
      window.location.reload();
    });
  }

  const paymentForm = document.getElementById('payment-form');
  const proceedPaymentBtn = document.getElementById('proceed-payment');

  if (paymentForm && proceedPaymentBtn && loginModal && transactionModal) {
    const creditCardDetails = document.getElementById('credit-card-details');
    const bankTransferDetails = document.getElementById('bank-transfer-details');
    document.querySelectorAll('input[name="payment-method"]').forEach(input => {
      input.addEventListener('change', () => {
        creditCardDetails.classList.remove('show');
        bankTransferDetails.classList.remove('show');
        if (input.value === 'credit-card') creditCardDetails.classList.add('show');
        if (input.value === 'bank-transfer') bankTransferDetails.classList.add('show');
      });
    });

    paymentForm.addEventListener('submit', e => {
      e.preventDefault();
    });

    proceedPaymentBtn.addEventListener('click', e => {
      e.preventDefault();
      const cart = getCart();
      if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
      }
      if (!localStorage.getItem('user')) {
        loginModal.style.display = 'block';
        return;
      }
      const totalAmount = cart.reduce((sum, item) => {
        const price = item.discount_available ? item.discounted_price : item.price;
        return sum + price * item.quantity;
      }, 0);
      const orderNumber = `ORD-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
      const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value === 'credit-card' ? 'Credit Card' : 'Bank Transfer';
      const transactionDate = new Date().toLocaleString();
      document.getElementById('order-number').textContent = orderNumber;
      document.getElementById('transaction-amount').textContent = `USD ${totalAmount.toLocaleString()}`;
      document.getElementById('transaction-date').textContent = transactionDate;
      document.getElementById('payment-method').textContent = paymentMethod;
      transactionModal.style.display = 'block';
    });

    window.addEventListener('message', (event) => {
      if (event.data === 'login-success') {
        console.log('Received login-success message');
        loginModal.style.display = 'none';
        updateLoginStatus();
        if (window.location.pathname.includes('cart.html')) {
          const cart = getCart();
          if (cart.length > 0) {
            const totalAmount = cart.reduce((sum, item) => {
              const price = item.discount_available ? item.discounted_price : item.price;
              return sum + price * item.quantity;
            }, 0);
            const orderNumber = `ORD-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
            const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value === 'credit-card' ? 'Credit Card' : 'Bank Transfer';
            const transactionDate = new Date().toLocaleString();
            document.getElementById('order-number').textContent = orderNumber;
            document.getElementById('transaction-amount').textContent = `USD ${totalAmount.toLocaleString()}`;
            document.getElementById('transaction-date').textContent = transactionDate;
            document.getElementById('payment-method').textContent = paymentMethod;
            transactionModal.style.display = 'block';
          }
        }
        window.location.reload();
      }
    });
  }

  const agentContactModal = document.getElementById('agent-contact-modal');
  const agentContactBtn = document.getElementById('agent-contact-btn');
  const agentContactClose = agentContactModal?.getElementsByClassName('close')[0];
  const agentContactForm = document.getElementById('agent-contact-form');

  if (agentContactBtn && agentContactModal && agentContactClose && agentContactForm) {
    agentContactBtn.addEventListener('click', () => { agentContactModal.style.display = 'block'; });
    agentContactClose.addEventListener('click', () => { agentContactModal.style.display = 'none'; });
    window.addEventListener('click', event => {
      if (event.target === agentContactModal) {
        agentContactModal.style.display = 'none';
      }
    });
    agentContactForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('agent-name')?.value;
      const email = document.getElementById('agent-email')?.value;
      const message = document.getElementById('agent-message')?.value;
      if (name && email && message) {
        alert(`Thank you, ${name}! Your message has been sent to our sales agent.`);
        agentContactModal.style.display = 'none';
        agentContactForm.reset();
      }
    });
  }

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