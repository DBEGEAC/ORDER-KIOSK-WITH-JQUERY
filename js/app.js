$(function () {
  const menuItems = [
    { id: 1, name: "Cheeseburger", price: 50, icon: "fa-hamburger" },
    { id: 2, name: "Fries", price: 30, icon: "fa-bacon" },
    { id: 3, name: "Soda", price: 20, icon: "fa-cup-straw" },
    { id: 4, name: "Chicken Nuggets", price: 40, icon: "fa-drumstick-bite" },
    { id: 5, name: "Ice Cream", price: 35, icon: "fa-ice-cream" },
  ];

  let cart = {};


  function loadMenu() {
    $("#menu-items").empty();
    menuItems.forEach(({ id, name, price, icon }) => {
      $("#menu-items").append(`
        <div class="menu-item" data-id="${id}">
          <i class="fa-solid ${icon} fa-4x"></i>
          <h3>${name}</h3>
          <p class="price">₱${price.toFixed(2)}</p>
          <button class="add-to-cart-btn">Add to Cart</button>
        </div>
      `);
    });
  }

  function updateCart() {
    const $cartItems = $("#cart-items");
    $cartItems.empty();

    const cartIds = Object.keys(cart);
    if (cartIds.length === 0) {
      $cartItems.append("<p>Your cart is empty.</p>");
      $("#checkout-btn").attr("disabled", true);
      $("#cart-total").text("Total: ₱0.00");
      return;
    }

    let total = 0;
    cartIds.forEach((id) => {
      const item = menuItems.find((m) => m.id == id);
      const qty = cart[id];
      const itemTotal = item.price * qty;
      total += itemTotal;

      $cartItems.append(`
        <div class="cart-item" data-id="${id}">
          <span>${item.name} (₱${item.price.toFixed(2)})</span>
          <div class="qty-controls">
            <button class="qty-btn decrease">-</button>
            <span>${qty}</span>
            <button class="qty-btn increase">+</button>
            <button class="remove-btn" title="Remove item">&times;</button>
          </div>
        </div>
      `);
    });

    $("#cart-total").text(`Total: ₱${total.toFixed(2)}`);
    $("#checkout-btn").attr("disabled", false);
  }

  $("#menu-items").on("click", ".add-to-cart-btn", function () {
    const id = $(this).closest(".menu-item").data("id");
    cart[id] = (cart[id] || 0) + 1;
    updateCart();
  });

  $("#cart-items").on("click", ".qty-btn", function () {
    const id = $(this).closest(".cart-item").data("id");
    if ($(this).hasClass("increase")) {
      cart[id]++;
    } else if ($(this).hasClass("decrease")) {
      if (cart[id] > 1) {
        cart[id]--;
      }
    }
    updateCart();
  });

  $("#cart-items").on("click", ".remove-btn", function () {
    const id = $(this).closest(".cart-item").data("id");
    delete cart[id];
    updateCart();
  });

  function showReceipt() {
    let receiptText = "Receipt\n";
    receiptText += "-----------------------------\n";

    let total = 0;
    for (const id in cart) {
      const item = menuItems.find((m) => m.id == id);
      const qty = cart[id];
      const itemTotal = item.price * qty;
      total += itemTotal;
      receiptText += `${item.name} x${qty} = ₱${itemTotal.toFixed(2)}\n`;
    }

    receiptText += "-----------------------------\n";
    receiptText += `Total: ₱${total.toFixed(2)}\n`;
    receiptText += "\nThank you for your order!";

    $("#receipt").text(receiptText).fadeIn();
    $("#checkout-btn").hide();
    $("#new-order-btn").show();
  }

  function newOrder() {
    cart = {};
    updateCart();
    $("#receipt").hide();
    $("#checkout-btn").show();
    $("#new-order-btn").hide();
  }

  $("#checkout-btn").on("click", function () {
    if (Object.keys(cart).length === 0) {
      alert("Your cart is empty.");
      return;
    }
    showReceipt();
  });

  $("#new-order-btn").on("click", newOrder);

  loadMenu();
  updateCart();
});
