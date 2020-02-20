const client = contentful.createClient({
    // This is the space ID. A space is like a project folder in Contentful terms
    space: "x2kh2pfmdwmn",
    // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
    accessToken: "fqLGxIgDojK9HVDW0EV0TTgM0Bscx_qGgmc9IlCMgos"
  });
  // variables
  const postsDOM = document.querySelector('.blog-posts-body');
  
  // getting the blog posts

  //when i get a new post create new file on the server with pagename each time a post is added
  
  // write function get post id when Id number changes 
  //create new page on server and append post to page 
  //send pageName to server and create new post with node function 
  class Posts {
    async getPosts() {
      try {
        
        let contentful = await client.getEntries({
          content_type: "kretinVilleBlogPostsPages"
        })
        // console.log(contentful)
        // let result = await fetch('../js/json/posts.json');
        // let data = await result.json();
        // let posts = data.items;
  
        let posts = contentful.items;
        posts = posts.map(item => {
          const { title, p } = item.fields;
          const { id } = item.sys;
          const image = item.fields.image.fields.file.url;
          return { title, p, id, image };
        });
        return posts;
      } catch (error) {
        console.log(error);
      }
    }
  }
  
  //get posts  
  // use node.js to create new .html file with post title name item.title
  // append posts to new file in body of html document
  //display blog posts

  class UI {
    displayPosts(posts) {
      let result = '';
      posts.forEach(posts => {
        result += `
          <article class="posts" style="border: 1px solid; margin: 1em; padding: 1em;">
            <div class="img-container">
                <img src=${posts.image} class="product-img">
                <button class="bag-btn" data-id=${posts.id}>
                    Post DATE${posts.id}
                </button>
            </div>
            <h3>${posts.title}</h3>
            <p>${posts.p}</p>
        </article>
          `;
      });
      postsDOM.innerHTML = result;
    }
  }
  
  //local storage blog
  class Storage {
    static savePosts(posts) {
      localStorage.setItem('posts', JSON.stringify(posts));
    }
    static getPosts(id) {
      let posts = JSON.parse(localStorage.getItem('posts'));
      return posts.find(posts => posts.id === id);
    }
  
    // product cart storage
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
    const posts = new Posts();
  
    //get all products
    posts.getPosts().then(posts => {
      ui.displayPosts(posts);
      Storage.savePosts(posts);
      Storage.saveProducts(products);
    });
  });
  
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
      });
  });
  