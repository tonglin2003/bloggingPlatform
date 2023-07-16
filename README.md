# bloggingPlatform

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

# API Endpoints:
#### a. post request: "/signup"
  - sign up an account for a user. Takes in `username` and `password`
  - it logs the user into session too
  - example body:
    ```
    {
    "username": "user2",
    "password": "password"
    }
    ```

#### b. post request: "/login"
  - login for a user. Takes in `username` and `password` and check if given input exist in the database
  - it logs the user into the session too
  - example body:
    ```
    {
    "username": "user2",
    "password": "password"
    }
    ```

#### c. get request: "/posts"
  - gets all posts in the database. Note: only available when the user is logged in.
  - doesn't require any body

#### d. get request: "/posts/:postId"
  - gets posts based on post id.
  - example request URL: "http://localhost:4000/posts/2"

#### e. post request: "/posts"
  The request will post a post in the database.
  example body:
  ```
  {
      "postTitle": "post 1",
      "postContent": "content 1",
      "postImgUrl": "urlToAnImage.jpg"
  }
  ```

#### f. patch request: "/posts/:postId"
  The request update a post and locate the post by the posted in the URL. And Body contains the fields that want to be changed
  - example URL: "http://localhost:4000/posts/3"
  - example body:
    ```
    {
    "postTitle": "edited post title",
    "postContent": "edited content"
    }
    ```

#### g. delete request: "/posts/:postId"
  The request delete a post and locate the post by the posted in the URL. The request doens't take in any input other than the postId
  example URL: "http://localhost:4000/posts/3"


#### h. post request: "/posts/:postId/comment
  The request will post a comment on a post. The post is located by the postId given in the URL.
  - example url: "http://localhost:4000/posts/3/comment"
  - example body:
    ```json
    {
    "commentContent": "comment1"
    }
    ```

#### i. patch request: "/posts/:postId/comment
  The request will update a comment on a post. The post is located by the postId given in the URL.
  - example url: "http://localhost:4000/posts/3/comment"
  - example body:
    ```json
    {
    "commentContent": "edited comment1"
    }
    ```

#### j. fetch request: "/posts/:postId/comment
  The request will return all the comments of a post. The post is located by the postId given in the URL.
  - example url: "http://localhost:4000/posts/2/comment"

#### k. fetch request: "/comment/:commentId"
  The request will return a comment based on the commentId. The comment is located by the commentId given in the URL.
  - example url: "http://localhost:4000/comment/1"

#### l. fetch request: "/user/comment"
  The request will return all comments of the current user. The userId is defined by the session when user logged in.
  - example url: "http://localhost:4000/user/comment"

#### m. delete request: "/comment/:commentId"
  The request will delete a comment based on commentId given.
  - example url: "http://localhost:4000/comment/1"



