const client = contentful.createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space: "x2kh2pfmdwmn",
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken: "fqLGxIgDojK9HVDW0EV0TTgM0Bscx_qGgmc9IlCMgos"
});
// variables
const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const checkoutBtn = document.querySelector('.checkout-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');
const cartTotalValue = document.querySelector('.cart-total-value');
const sizeBtn = document.querySelector('.btn-size')

//cart
let cart = [];
let buttonsDOM = [];

// getting the products
class Products {
  async getProducts() {
    try {

      let contentful = await client.getEntries({
        content_type: "kretinVilleProduct"
      })
      // console.log(contentful)
      // let result = await fetch('js/json/products.json');
      // let data = await result.json();
      // let products = data.items;
      
      let products = contentful.items;
      products = products.map(item => {
        const { title, price } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return { title, price, id, image };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}
//display products
class UI {
  displayProducts(products) {
    let result = '';
    products.forEach(product => {
      result += `
      <article class="product">
        <div class="img-container">
            <img src=${product.image} class="product-img">
            <button class="bag-btn" data-id=${product.id}>
                <i class="fa fa-shopping-cart"></i>
                add to bag
            </button>
        </div>
        <h3>${product.title}</h3>
        <h4>$${product.price}</h4>
        <button class="btn-size" onclick="classList.toggle('active')">7.75</button>
        <button class="btn-size" onclick="classList.toggle('active')">8.25</button>
        <button class="btn-size" onclick="classList.toggle('active')">8.5</button>
        <button class="btn-size" onclick="classList.toggle('active')">9</button>
        
    </article>
      `;
    });
    productsDOM.innerHTML = result;
  }
  getBagButtons() {
    const buttons = [...document.querySelectorAll('.bag-btn')];
    buttonsDOM = buttons;
    buttons.forEach(button => {
      let id = button.dataset.id;
      let inCart = cart.find(item => item.id === id);
      if (inCart) {
        button.innerText = 'In Cart';
        button.disabled = true;
      }
      button.addEventListener('click', event => {
        event.target.innerText = 'In Cart';
        event.target.disabling = true;
        //get product from products
        let cartItem = { ...Storage.getProducts(id), amount: 1 };
        console.log(cartItem);
        //add product to the cart
        cart = [...cart, cartItem];
        //save cart in local storage
        Storage.saveCart(cart);
        //set cart values
        this.setCartValues(cart);
        //add cart items
        this.addCartItem(cartItem);
        //show cart
        this.showCart();
      });
    });
  }
  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map(item => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
  }
  addCartItem(item) {
    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `<div class="cart-item">
    <img src=${item.image} alt="cart-image">
    <div>
        <h3>${item.title}</h3>
        <h4>$${item.price}</h4>
        <h5>${sizeBtn}<h5>
        <span class="remove-item" data-id=${item.id}>remove</span>
    </div>
    <div>
        <i class="fa fa-chevron-up" data-id=${item.id}></i>
        <p class="item-amount">${item.amount}</p>
        <i class="fa fa-chevron-down" data-id=${item.id}></i>

    </div>
</div>`;
    cartContent.appendChild(div);
  }
  showCart() {
    cartOverlay.classList.add('transparentBcg');
    cartDOM.classList.add('showCart');
  }
  setupAPP() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    cartBtn.addEventListener('click', this.showCart);
    closeCartBtn.addEventListener('click', this.hideCart);
  }
  populateCart(cart) {
    cart.forEach(item => this.addCartItem(item));
  }
  hideCart() {
    cartOverlay.classList.remove('transparentBcg');
    cartDOM.classList.remove('showCart');
  }
  cartLogic() {
    clearCartBtn.addEventListener('click', () => {
      this.clearCart();
    });
    checkoutBtn.addEventListener('click', () => {
      this.checkout();
    });
    cartContent.addEventListener('click', event => {
      if (event.target.classList.contains('remove-item')) {
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        // cartContent.removeChild(cartContent.children[0]);
        cartContent.removeChild(removeItem.parentElement.parentElement);
        // remove item
        this.removeItem(id);
      } else if (event.target.classList.contains('fa-chevron-up')) {
        let addAmount = event.target;
        let id = addAmount.dataset.id;
        let tempItem = cart.find(item => item.id === id);
        tempItem.amount = tempItem.amount + 1;
        Storage.saveCart(cart);
        this.setCartValues(cart);
        addAmount.nextElementSibling.innerText = tempItem.amount;
      } else if (event.target.classList.contains('fa-chevron-down')) {
        let lowerAmount = event.target;
        let id = lowerAmount.dataset.id;
        let tempItem = cart.find(item => item.id === id);
        tempItem.amount = tempItem.amount - 1;
        if (tempItem.amount > 0) {
          Storage.saveCart(cart);
          this.setCartValues(cart);
          lowerAmount.previousElementSibling.innerText = tempItem.amount;
        } else {
          cartContent.removeChild(lowerAmount.parentElement.parentElement);
          this.removeItem(id);
        }
      }
    });
  }
  clearCart() {
    // console.log(this);
    let cartItems = cart.map(item => item.id);
    cartItems.forEach(id => this.removeItem(id));
    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }
    this.hideCart();
  }
  checkout() {
    let item;
    const data = {};
    data.line_items = cart.map(cartObj => {
      item = {};
      item.amount = Math.round(cartObj.price * 100);
      item.images = [cartObj.image];
      item.name = cartObj.title;
      item.quantity = cartObj.amount;
      item.currency = 'usd';
      return item;
    });
    axios
      .post('/stripe/checkout-onetime', data)
      .then(res => {
        const { session } = res.data;
        this.stripe(session.id);
      })
      .catch(err => {
        console.log('err', err);
      });
  }
  stripe(sessionId) {
    var stripe = Stripe('pk_live_08nfNJQ7HfTIOoCYbHcEk0Ay00Tzs0JfVmF');
    (async () => {
      const { error } = await stripe.redirectToCheckout({
        // Make the id field from the Checkout Session creation API response
        // available to this file, so you can provide it as parameter here
        // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
        sessionId
      });
      if (error) {
        console.log(error.message);
      }
    })();
  }
  removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `<i class="fa fa-shopping-cart"></i>add to bag`;
  }
  getSingleButton(id) {
    return buttonsDOM.find(button => button.dataset.id === id);
  }
}
//local storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
  }
  static getProducts(id) {
    let products = JSON.parse(localStorage.getItem('products'));
    return products.find(product => product.id === id);
  }
  static saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  static getCart() {
    return localStorage.getItem('cart')
      ? JSON.parse(localStorage.getItem('cart'))
      : [];
  }
}
document.addEventListener('DOMContentLoaded', () => {
  const ui = new UI();
  const products = new Products();
  //setup app
  ui.setupAPP();
  //get all products
  products
    .getProducts()
    .then(products => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getBagButtons();
      ui.cartLogic();
    });
});
