# Rewrite BE Assesement

> This is my aproach of rewriting my first BE assessent [festimatch](https://github.com/Marijnone/be-assessment-2). Which is very unreadable and has many functions running trough each other. Next to that is that app written in mysql. And i've wanted to give Mongodb a try.

> So in this readme i will describe the different approaches to build a more readable and understandable node application. What i have now is a fully functional REST Api where users can signup, signin out, update and delete their account.
> This is tested trough Postman since i not yet have build the Front-end i've run into some problems there. But to show that i understand the topic and how backend works i will give some of the most important features.

>

## File structure 🗃

To begin to make the app more readable i've broken up things like Routes, models, views, before this was all stored in the index.js file. Now there is 1 file called server.js which holds the basic server configuration.

## Code rewrite

I've started by installing a linter, this takes out most of the work of reading consistent code. i've used [this](https://github.com/wesbos/eslint-config-wesbos) linter config.

#### MongoDB

I used mongoDB Atlas to host my DB in the cloud. Then i started to build the connection in /db/mongoose.js i used mongoose to build a user model in /models/user.js. With this model it's easier to communicate with the db
and also there are easier to read.

#### Async Await

i've rewritten everything into the async await syntax, i've always found it very hard to understand this syntax and still in some cases its complicated. But in this project i've finally got some experience working with this syntax. Like the code below is easy to read and in my opinion to understand. The await waits (hehe) for the User model function FindByCredentials to resolve and after that generates an auth token.

```js
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    // res.send({ user, token });
    res.render("users/profile.ejs", { token, user });
  } catch (e) {
    // res.status(400).send();
    res.render("users/error.ejs", { e }).res.status(400);
  }
});
```

i can no easily use the User.method from the mongoose.js file and return users.

```js
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.render("users/overview.ejs", { users });
  } catch (e) {
    res.status(500).send();
  }
});
```

This works trough out Index.js in best practice i would create a diffrent router for the users but in this case i put the code in index.js. In my opinion is it still very readable. There are alot of comments in my code this to make sure i know whats going on.

#### Postman & Further progress

I've tested everything with postman and that worked really well. I know need to configure the front end in a proper way. Since i make an auth token which i can then use in postman by setting it in the header as Authorization, but i was having alot of trouble getting this auth token and send it trough trough the front end. So using fetch and setting the header to use the Bearer token is the next thing to do for know i removed the auth token because it was not working correctly it is suppose to protect certain routes from being viewed by unregistered users. As you can see alot of the 
