const express = require('express');
const fs = require('fs')
const multer = require('multer');
const User = require("../models/user");
const route = express.Router();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads")
  },
  filename: (req, file, cb) => {
    // req.body = file.fieldname + Date.now() + ".jpg"
    const ext = file.mimetype.split("/")[1];

    let fileName = `${file.fieldname}-${Date.now()}.${ext}`
    req.body.profile = fileName;
    console.log(file);
    cb(null, fileName)
  }
})

const upload = multer({
  storage: storage
}).single("profile");

route.post("/users/add", upload, async function (req, res) {
  console.log(req.body);
  // console.log("file", req.file.originalname);
  // const ext = req.file.mimetype.split("/")[1];

  // let fileName = `${req.file.fieldname}-${Date.now()}.${ext}`

  try {

    const user = new User({ name: req.body.name, email: req.body.email, number: req.body.number })
    console.log(user);
    if (req.body.profile) {
      user.profile= req.body.profile
    }
    await user.save()
    return res.send(user)

    // const user = new User({ name: req.body.name, email: req.body.email, number: req.body.number, profile: req.body.profile })
    // await user.save()
    // console.log(user);
    // res.send(user)

  } catch (e) {
    if (e.keyPattern.email) {
      return res.status(500).send({ message: "Email already Exists", value: "email" });
    }
    if (e.keyPattern.number) {
      return res.status(500).send({ message: "Phone Number already Exists", value: "number" });
    }
    res.status(500).send(e);
  }
})

route.post('/users/:id', upload, async (req, res) => {
  const _id = req.params.id;
  console.log("body", req.body);
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "number", "_id", "profile"]
  const isValidOperaton = updates.every((element) => allowedUpdates.includes(element));
  console.log("is valid", isValidOperaton);
  if (!isValidOperaton) {
    return res.status(400).send({ "error": "Invalid Update" })
  }

  try {
    const user = await User.findById(_id);
    let fileName = user['profile'];
    // user["profile"] = req.file.originalname;
    updates.forEach((update) => {
      user[update] = req.body[update];
    })
    console.log("user profile", user.profile);
    if (req.file) {
      console.log("from Update", req.file);

      var filePath = `./public/uploads/${fileName}`;
      user['profile'] = req.file.filename;
      console.log('pro from update', user["profile"]);


      fs.stat(filePath, function (err, stats) {
        console.log(stats);//here we got all information of file in stats variable

        if (err) {
          return console.error(err);
        }

        fs.unlink(filePath, function (err) {
          if (err) return console.log(err);
          console.log('file deleted successfully');
        });
      });


    }

    console.log("req.file", req.file);
    // if (req.file) {
    //   user["profile"] = req.file.originalname;
    //   console.log('pro from update',user["profile"]);
    // }
    await user.save();

    if (!user) {
      return res.status(404).send(user)
    }
    res.send(user);
  } catch (e) {
    if (e.keyPattern.email) {
      return res.status(500).send({ message: "Email already Exists", value: "email" });
    }
    if (e.keyPattern.number) {
      return res.status(500).send({ message: "Phone Number already Exists", value: "number" });
    }
    res.status(500).send(e);
  }

})



route.get("/users", async (req, res) => {
  try {
    const user = await User.find()
    if (!user) {
      return res.send("no user")
    }
    // console.log(user);
    res.send(user)
  } catch (e) {
    res.status(500).send(e)
  }
})

route.get("/users/page", async (req, res) => {

  let page = parseInt(req.query.page)
  let limit = parseInt(req.query.limit)
  console.log("limit before", limit);
  if (!limit) {
    limit = 5;
  }
  if (!page) {
    page = 1;
  }
  let skip = (page - 1) * limit;
  let totolPage;
  try {
    console.log(typeof limit, limit);
    console.log(typeof skip, skip);
    const user = await User.find().limit(limit).skip(skip).sort({ "createdAt": "desc" });
    const count = await User.find().count()
    totolPage = Math.ceil(count / limit)
    if (!user) {
      return res.send("no user")
    }
    // console.log(user);
    res.send({ user, count, totolPage })
  } catch (e) {
    res.status(500).send(e)
  }
})


route.get("/search", async function (req, res) {
  console.log("key", req.query.key);
  console.log("req.query", req.query);
  console.log("{}kjk", !{});
  console.log("req.que", !req.query.key);
  if (!req.query.key == '') {
    console.log("Ifcondition");
    let key = req.query.key
    // let key = /^`${key1}`$/i
    // console.log("Modify key", key);
    let limit = 5;
    let page = req.query.page
    if (!req.query.page) {
      page = 1
    }

    console.log("limit", limit);
    try {
      console.log('page', page);
      let skip = (page - 1) * limit;
      let totolPage;
      const user = await User.find({
        "$or": [{ name: { $regex: key, $options: "i" } },
        { email: { $regex: key, $options: "i" } },
        { number: { $regex: key, $options: "i" } }
        ]
      }).limit(limit).skip(skip).sort({ "createdAt": "desc" });
      const count = await User.find({
        "$or": [{ name: { $regex: key, $options: "i" } },
        { email: { $regex: key, $options: "i" } },
        { number: { $regex: key, $options: "i" } }
        ]
      }).count()

      totolPage = Math.ceil(count / limit)
      if (!user) {
        return res.send("no user")
      }
      // console.log(user);
      return res.send({ user, count, totolPage })
    } catch (e) {
      return res.status(500).send(e)
    }

  } else {

    console.log("else condition");
    let key = req.query.key
    console.log(key);
    let page = parseInt(req.query.page)
    let limit = parseInt(req.query.limit)
    console.log("limit before", limit);
    if (!limit) {
      limit = 5;
    }
    if (!page) {
      page = 1;
    }
    let skip = (page - 1) * limit;
    let totolPage;
    try {

      const user = await User.find({
        "$or": [{ name: { $regex: key } },
        { email: { $regex: key } },
        { number: { $regex: key } }
        ]
      }).limit(limit).skip(skip).sort({ "createdAt": "desc" });

      const count = await User.find({
        "$or": [{ name: { $regex: key } },
        { email: { $regex: key } },
        { number: { $regex: key } }
        ]
      }).count()
      totolPage = Math.ceil(count / limit)

      if (!user) {
        return res.send("No User found")
      }
      res.send({ user, count, totolPage });

    } catch (error) {
      res.status(500).send(error)
    }
  }


})

// route.get("/search", async function (req, res) {
//   console.log(req.query.key);
//   try {
//     const user = await User.find({
//       "$or": [{ name: { $regex: req.query.key } },
//       { email: { $regex: req.query.key } },
//       { number: { $regex: req.query.key } }
//       ]
//     })
//     if (!user) {
//       return res.send("No User found")
//     }
//     res.send(user);

//   } catch (error) {
//     res.status(500).send(error)
//   }

// })




// route.get("/search", async function (req, res) {

//   try {
//     const user = await User.find()
//     if (!user) {
//       return res.send("No User found")
//     }
//     res.send(user);
//     // res.render("index",{user})

//   } catch (error) {
//     res.status(500).send(error)
//   }

// })


route.get("", async (req, res) => {
  try {
    const user = await User.find()
    if (!user) {
      res.send("no user")
    }
    // console.log(user);
    res.render("index", { user })
  } catch (e) {
    res.status(500).send(e)
  }
})


route.get('/users/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send(user);
    }
    res.send(user);
  }
  catch (e) {
    res.status(500).send(e);
  }
})


route.delete('/users/:id', async (req, res) => {
  try {
    const _id = req.params.id
    const user = await User.findById(_id)
    const fileName = user.profile;
    var filePath = `./public/uploads/${fileName}`;

    fs.stat(filePath, function (err, stats) {
      console.log(stats);//here we got all information of file in stats variable

      if (err) {
        return console.error(err);
      }

      fs.unlink(filePath, function (err) {
        if (err) return console.log(err);
        console.log('file deleted successfully');
      });
    });

    await User.findByIdAndDelete(_id);
    res.send('Your account removed');
  } catch (e) {
    res.status(500).send(e);
  }
})


module.exports = route;