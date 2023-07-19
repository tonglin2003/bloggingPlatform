# bloggingPlatform Setup

# Backend Node.js and Express
1. Be sure to be inside the "blog-api" folder. Inside the terminal, enter the following commands to get the project be prepared for the Sequelize ORM and connection to PostgreSQL:
```
npm install pg
npm install dotenv
npm install install --save sequelize sequelize-cli pg-hstore
```

2. We will also download our bcryptjs to secure our API information. Enter the following in the terminal:
```
npm install bcryptjs
```

3. Now we will download packages for Node.js and Express, and also our session for our "users" to log in and make sure their session is working. Enter the followings in the terminal:
```
npm install express
npm install express-session
```

4. Finish setting up the session. Inside the terminal, type `node` and hit `enter. Type the following:
  ```
  require("crypto").randomBytes(64).toString("hex")
  ```
And you will get your unique `generated secret`, copy it and we will use it later!

5. Create `.env` inside your `blog-api` folder and enter your private information in the following format:
```
DB_USER=<DB user>
DB_HOST=localhost
DB_NAME=<DB_Name that you will be using>
DB_PASSWORD=<DB Password>
DB_PORT=5432
SESSION_SECRET=<generated secret>
```

6. Now we will create tables and fields inside the database with Sequelize. Enter the following in the terminal:
The command will create the tables and fields in the database based on what were inside the folder `migrations`
```
npx sequelize-cli db:migrate
```
The command below will generate some data inside the tables with `seeders`
```
npx sequelize-cli db:seed:all
```

7. Now we can start running the API!
```
npm start
```
The terminal might ask you to download nodemon, so you can download it by `sudo npm install -g nodemon`

8. We can start to use our api with Postman API or any tools as long as it can handle the HTTP request.
I have provided some fake data to be used in the Postman API and the link is attached. Feel free to use or use it as a reference.
Postman API: https://www.postman.com/docking-module-geoscientist-19290917/workspace/blog-platform/collection/25222511-155142d7-04c1-4f83-b3db-defc1b0eae1b?action=share&creator=25222511

# Frontend React
1. cd to `blog-client` with a new terminal or you may use the old one if you wish.

2. enter the following in the terminal:
```
npm install
npm install react-router-dom
```

3. Now we can start the react! Enter in the terminal:
```
npm run dev
```

#### Notes: Please start both servers, by running node.js by `npm start` and running `npm run dev` for the react.

# API Endpoints:
#### a. post request: "/api/auth/signup"
  - sign up an account for a user. Takes in `username` and `password`
  - it logs the user into the session too
  - example body:
    ```
    {
    "username": "user2",
    "password": "password"
    }
    ```

#### b. post request: "/api/auth/login"
  - login for a user. Takes in `username` and `password` and check if given input exist in the database
  - it logs the user into the session too
  - example body:
    ```
    {
    "username": "user2",
    "password": "password"
    }
    ```

#### c. get user's post: "/api/posts/user"
  - get all user's posts. Note: only available when the user is logged in.

#### d. get request: "/api/posts"
  - gets all posts in the database. Note: only available when the user is logged in.
  - doesn't require any body

#### e. get request: "/api/posts/:postId"
  - gets posts based on post id.
  - example request URL: "http://localhost:4000/posts/2"

#### f. post request: "/api/posts"
  The request will post a post in the database.
  example body:
  ```
  {
      "postTitle": "post 1",
      "postContent": "content 1",
      "postImgUrl": "urlToAnImage.jpg"
  }
  ```

#### g. patch request: "/api/posts/:postId"
  The request update a post and locate the post by the posted in the URL. And Body contains the fields that want to be changed
  - example URL: "http://localhost:4000/posts/3"
  - example body:
    ```
    {
    "postTitle": "edited post title",
    "postContent": "edited content"
    }
    ```

#### h. delete request: "/api/posts/:postId"
  The request delete a post and locate the post by the posted in the URL. The request doens't take in any input other than the postId
  example URL: "http://localhost:4000/posts/3"


#### i. post request: "/api/posts/:postId/comment
  The request will post a comment on a post. The post is located by the postId given in the URL.
  - example url: "http://localhost:4000/posts/3/comment"
  - example body:
    ```json
    {
    "commentContent": "comment1"
    }
    ```

#### j. patch request: "/api/posts/:postId/comment
  The request will update a comment on a post. The post is located by the postId given in the URL.
  - example url: "http://localhost:4000/posts/3/comment"
  - example body:
    ```json
    {
    "commentContent": "edited comment1"
    }
    ```

#### k. fetch request: "/api/posts/:postId/comment
  The request will return all the comments of a post. The post is located by the postId given in the URL.
  - example url: "http://localhost:4000/posts/2/comment"

#### l. fetch request: "/api/comment/:commentId"
  The request will return a comment based on the commentId. The comment is located by the commentId given in the URL.
  - example url: "http://localhost:4000/comment/1"

#### m. fetch request: "/api/user/comment"
  The request will return all comments of the current user. The userId is defined by the session when user logged in.
  - example url: "http://localhost:4000/user/comment"

#### n. delete request: "/api/comment/:commentId"
  The request will delete a comment based on commentId given.
  - example url: "http://localhost:4000/comment/1"



