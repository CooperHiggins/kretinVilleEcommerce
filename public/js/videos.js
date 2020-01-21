// const client = contentful.createClient({
//   // This is the space ID. A space is like a project folder in Contentful terms
//   space: "x2kh2pfmdwmn",
//   // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
//   accessToken: "fqLGxIgDojK9HVDW0EV0TTgM0Bscx_qGgmc9IlCMgos"
// });
// variables
const videosDOM = document.querySelector('.videos-center');

// getting the blog posts
class Videos {
  async getVideos() {
    try {

      // let contentful = await client.getEntries({
      //   content_type: "kretinVilleVideos"
      // })
      let result = await fetch('..js/json/videos.json');
      let data = await result.json(); 
        let videos = data.items;
        // let videos = contentful.items;
        videos = videos.map(item =>{
          const {title,p} = item.fields;
          const {id} = item.sys
          const image = item.fields.image.fields.file.url;
          return {title,p,id,image}
        })
        return videos;
    } catch (error) {
      console.log(error);
    }
  }
}
//display video posts
class UI {
  displayVideos(videos) {
    let result = '';
    videos.forEach(videos => {
      result += `
        <article width="100%">
          <div class="video-container" style="height: 30em;">
          <iframe width="100%" height="100%" src="${videos.image}" 
          frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen></iframe>
          </div>
          <h3>${videos.title}</h3>
          <p>${videos.p}</p>
      </article>
        `;
    });
    videosDOM.innerHTML = result;
  }
}

//local storage videos
class Storage {
  static saveVideos(videos) {
    localStorage.setItem('videos', JSON.stringify(videos));
  }
  static getVideos(id) {
    let videos = JSON.parse(localStorage.getItem('videos'));
    return videos.find(videos => videos.id === id);
  }

  // product cart storage
  static saveVideos(videos) {
    localStorage.setItem('videos', JSON.stringify(videos));
  }
  static getVideos(id) {
    let videos = JSON.parse(localStorage.getItem('videos'));
    return videos.find(videos => videos.id === id);
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
  const videos = new Videos();

  //get all videos
  videos.getVideos().then(videos => {
    ui.displayVideos(videos);
    Storage.saveVideos(videos);
    Storage.saveVideos(videos);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const ui = new UI();
  const videos = new Video();
  //setup app
  ui.setupAPP();
  //get all videos
  videos
    .getVideos()
    .then(videos => {
      ui.displayVideos(videos);
      Storage.saveVideos(videos);
    })
    .then(() => {
      ui.getBagButtons();
    });
});

products;
