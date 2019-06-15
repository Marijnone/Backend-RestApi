# Rewrite BE Assesement

> This is my aproach of rewriting my first BE assessent. Which is very unreadable and has many functions running trough each other. Next to that is that app written in mysql. And i've wanted to give Mongodb a try.

> So in this readme i will describe the different approaches to build a more readable and understandable node application. What i have now is a fully functional REST Api where users can signup, signin out, update and delete their account.
> This is tested trough Postman since i not yet have build the Front-end i've run into some problems there. But to show that i understand the topic and how backend works i will give some of the most important features.

>

## File structure 🗃

To begin to make the app more readable i've broken up things like Routes, models, views, before this was all stored in the index.js file. Now there is 1 file called server.js which holds the basic server configuration.

## Code rewrite

I've started by installing a linter, this takes out most of the work of reading consistent code. i've used [this](https://github.com/wesbos/eslint-config-wesbos) linter config.

#### MongoDB

To get

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
