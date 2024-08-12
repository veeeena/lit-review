# Lit Review
This project is a platform for readers and authors to share their insights and writing with a community of people with similar interests in books and reading! The project is built using the ReactJS framework, with Javascript, HTML, and CSS for the front-end. It also makes use of Bootstrap for styling. The backend is done using Node.js, and the relevant code is in my [lit-review-server-app](https://github.com/veeeena/lit-review-server-app) repository. The backend is a RESTful Web service API implemented as a Node HTTP server application.

The application supports CRUD operations for users, books, and reviews. There are two types of end users, readers and authors, with different CRUD abilities. It also makes use of the [Open Library API](https://openlibrary.org/developers/api) to get information about and allow users to make reviews for books not created by users. 

The website's frontend is hosted on [Netlify](https://main--endearing-brioche-ccf704.netlify.app/). This can be interacted with by searching for books, but any backend functionality (signing in/up, leaving reviews, etc) will not work unless the server is manually deployed on Render.js. Please [contact me](mailto:vkodakirthi@gmail.com) if you'd like to interact with the site further! 

## Installation
```bash
npm install
```

## Usage

```bash
npm start
```

## License
© Veena Kodakirthi (2023)
[MIT](https://choosealicense.com/licenses/mit/)
