# Rewrite BE Assesement

> This is my aproach of rewriting my first BE assessent [festimatch](https://github.com/Marijnone/be-assessment-2). Which is very unreadable and has many functions running trough each other. Next to that is that app written in mysql. And i've wanted to give Mongodb a try.

> So in this readme i will describe the different approaches to build a more readable and understandable node application. What i have now is a fully functional REST Api where users can signup, signin out, update and delete their account.
> This is tested trough Postman since i not yet have build the Front-end i've run into some problems there. But to show that i understand the topic and how backend works i will give some of the most important features.

>

## File structure 🗃

To begin to make the app more readable i've broken up things like Routes, models, views, before this was all stored in the index.js file. Now there is 1 file called server.js which holds the basic server configuration. And /routes/index.js holds the routes all the routes and functions. I've could break this up in different routers like user router etc. But i did not think that was nessecary at this point.

## Code rewrite

I've started by installing a linter, this takes out most of the work of writing consistent code. i've used [this](https://github.com/wesbos/eslint-config-wesbos) linter config.

#### MongoDB

I used mongoDB Atlas to host my DB in the cloud. Then i started to build the connection in /db/mongoose.js i used mongoose to build a user model in /models/user.js. With this model it's easier to communicate with the db
and also there are easier to read.

#### Async Await

i've rewritten everything into the async await syntax, i've always found it very hard to understand this syntax and still in some cases its complicated. But in this project i've finally got some experience working with this syntax. Like the code below is easy to read and in my opinion to understand. The await waits (hehe) for the User model function FindByCredentials to resolve and after that generates an auth token.

#### Login function

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

#### Register function

```js
router.post("/users/register", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.render("users/succes.ejs", { user, token }).status(200);
  } catch (e) {
    res.status(400).send(e);
  }
});
```

I can no easily use the User.method from the mongoose.js file and return users.

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

This works trough out Index.js in best practice i would create a diffrent router for the users but in this case i put the code in index.js. In my opinion is it still very readable.

When the code got a little complex like the update function for example i've added comments

```js
// update the user value gets a little more difficult because some mongoose
// methods can be called without notice of the middelware, to make sure our update gets trough correctly we have to change this
// by creating a sort of guard that make sure that the updates are allowed
// its some pretty complex code in my opinion but i understand what is happening
router.post("/users/me/edit", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    res.status(400).send({ error: "Invalid updates this is not allowed" });
  }
  try {
    // make the update the same as the user gives in req.body dynamic
    updates.forEach(update => (req.user[update] = req.body[update]));

    await req.user.save();
    res.send(req.user);
    res.render("profile.ejs", { user });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});
```

#### Postman & Further progress

I've tested everything with postman and that worked really well. I now need to configure the front end in a proper way. Since i make an auth token which i can then use in postman by setting it in the header as Authorization, but i was having alot of trouble getting this auth token and send it trough trough the front end. So using fetch and setting the header to use the Bearer token is the next thing to do for know i removed the auth token because it was not working correctly it is suppose to protect certain routes from being viewed by unregistered users.

As you can see alot of the //lines between the res objects this is because i was trying alot of things with the rendering of the pages. I let it in to show a bit of the progress.

#### Sources

[Mongoose doc](https://mongoosejs.com/)

[Udemy node developer course](https://www.udemy.com/the-complete-nodejs-developer-course-2/learn/lecture/13729240#overview)

[Get programming with node.js (O'Reilly)](https://learning.oreilly.com/library/view/get-programming-with/9781617294747/)
