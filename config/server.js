const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const os = require('os');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const methodOverride = require('method-override');
const morgan = require('morgan');

const fs = require('fs'); // added node file system
// const blogPages = require('../public/js/blogPages.js');
const jsonObj = require('../public/js/json/posts.json');

// for(var attributename in myobject){
//   console.log(attributename+": "+myobject[attributename]);
// }

var sys = {'key':'value', 'key2':'value2'};

for(var sys in jsonObj) {
  console.log(sys+": "+jsonObj[sys]);
}


const config = require('./config');
const logger = require('./logger');

const { l, stream } = logger;

const rootDir = config.root;
const app = express();

module.exports = class ExpressServer {
  constructor() {
    app.set('appPath', `${config.root}client`);
    app.use(morgan('combined', { stream }));
    app.use(compression());
    app.use(methodOverride());
    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.json({ limit: process.env.REQUEST_LIMIT || '100kb' }));
    app.use(
      bodyParser.urlencoded({
        extended: true,
        limit: process.env.REQUEST_LIMIT || '100kb'
      })
    );
    app.use(cookieParser(process.env.SESSION_SECRET));
    app.use(express.static(`${config.root}/public`));
  }
  
  router(routes) {
    routes(app);
    // 404 error handler
    app.use((req, res, next) => {
      const err = new Error('404 - route not found');
      err.status = 404;
      next(err);
    });
    // eslint-disable-next-line no-unused-vars, no-shadow
    // 500 error handlers
    app.use((err, req, res, next) => {
      if (process.env.NODE_ENV !== 'productions') {
        console.log(err.message);
      }
      res.status(err.status || 500);
      res.json({ message: err.message });
    });
    return this;
  }

  listen(port) {
    const welcome = port => () =>
      l.info(
        `up and running in ${process.env.NODE_ENV ||
          'development'} @: ${os.hostname()} on port: ${port}` // removed } from ${port}
      );
    http.createServer(app).listen(port, welcome(port));
    return app;
  }
};

//write function when json object is added get file name and create new file

// getObjectFileName {
// get id value from object 
// when last id value is less than new id value 
// get pageName value and create variable to pass to append file function
// 
// get newPageName title value from object     with id greater than last id and create variable 
// and pass variable to appendFile function 
// new variable value creates new page with appenFile 
// }

// getFileName {
//   let filename = jsonObj.items;
//   filename = filename.map(item => {
//       const { title, p } = item.fields;
//       const { id } = item.sys;
//       const image = item.fields.image.fields.file.url;
//       return { title };
//   }
// }

//create a file with the json object title  get file name from blog-pages.json file with js in blog3.js document

// returned title of page in json object ${title}
//'./public/html/${filename}'

fs.appendFile( sys, `<!DOCTYPE html> 
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>KretinVille Blog</title>
    <!-- FONT AWESOME CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
    <!-- MAIN CSS -->
    <link rel="stylesheet" href="../css/main.css">
</head>

<body>

<!-- NAVBAR -->
<nav class="navbar">
    <div class="navbar-center">

        <!-- <span onClick="dropDown()">
            <i class="fa fa-bars"></i>
        </span> -->
        
        <!-- <div class="">
            <a href="login.html" class="login-btn">Admin Login</a>
        </div> -->

        <a href="../index.html">
            <!-- <img class="img-fluid" id="logo" src="../images/kretinville-skateboards.png" /> -->
            <p class="logo">KretinVille</p>
        </a>
        <div class="">
            <a href="blog.html" class="login-btn">Blog</a>
        </div>
        <div class="">
            <a href="skateboards-catalog.html" class="login-btn">Catalog</a>
        </div>
        <div class="">
            <a href="skateboard-videos.html" class="login-btn">Videos</a>
        </div>
        <div class="cart-btn">
            <span class="nav-icon">
                    <i class="fa fa-cart-plus"></i>
                </span>
                <div class="cart-items">0</div>
        </div>
    </div>
</nav>
    
    <!-- end nav -->

<!-- end nav -->

<!-- hero -->
<header class="hero">
    <div class="banner">
            <h1 class="banner-title">KretinVille Blog Page</h1>
            <a href="#posts-center" class="scroll" id="posts-center"><button class="banner-btn">See Posts</button></a>
    </div>
</header>
<!-- hero -->

<div class="blog-posts-body">
        
</div>

<!-- start footer  -->
<footer class="">
    <p class="text-center"><span class="copyright">&copy;</span> Kretinville Skateboards</p>
</footer>
<!-- end footer  -->
<!-- contentful -->
<script src="https://cdn.jsdelivr.net/npm/contentful@latest/dist/contentful.browser.min.js"></script>
<script src="../js/blog3.js"></script>

</body>
</html>` , function (err) {
  if (err) throw err;
  console.log('Saved!');
});

