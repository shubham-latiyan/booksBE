require("dotenv").config();
const Users = require('../model/Users');
const Books = require('../model/Books');
const Purchase = require('../model/Purchase');
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');



exports.getBooks = async (req, res) => {
  try {
    let data = await Books.find({
      units: { $gt: 0 }
    })
    // console.log('data:', data)
    if (data.length) {
      res.json({
        success: true,
        data
      })
    }
    else {
      res.json({
        success: false,
        data: []
      })
    }
  } catch (err) {
    console.log('err:', err)
    res.json({
      success: false,
      err: err
    })
  }
}

exports.saveBooks = async (req, res) => {
  // console.log('req:', req.body)
  try {
    let data = new Books({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      units: req.body.units
    })
    await data.save();
    // console.log('data:', data)
    if (data) {
      res.json({
        success: true,
        data
      })
    }
    else {
      res.json({
        success: false,
        data: []
      })
    }
  } catch (err) {
    console.log('err:', err)
    res.json({
      success: false,
      err: err
    })
  }
}

exports.addUsers = async (req, res) => {
  // console.log('req:', req.body)
  try {
    let user = await Users.findOne({ email: req.body.email });
    if (user == null) {
      let data = new Users({
        email: req.body.email,
        password: req.body.password,
      })
      await data.save();
      const payload = {
        username: data._id,
        expires: Date.now() + parseInt(process.env.jwtExpireTime),
      };
      const token = await jwt.sign(payload, process.env.jwtSectret)

      res.json({
        success: true,
        data,
        token
      })
    }
    else {
      res.json({
        success: true,
        data: "user already exists"
      })
    }
  } catch (err) {
    console.log('err:', err)
    res.json({
      success: false,
      err: err
    })
  }
}

exports.getUser = async (req, res) => {
  // console.log('idddd', req.params.userId);
  
  try {
    if (req.params.userId != null) {
      let data = await Users.findOne({
        _id: mongoose.Types.ObjectId(req.params.userId)
      })
      res.json({
        success: true,
        data
      })
    }
    else {
      res.json({
        success: false,
        error: "user not found"
      })
    }

  } catch (err) {
    res.json({
      success: false,
      error: err
    })
  }
}
exports.signInUser = async function (req, res) {
  // console.log('datat', req.body)
  let data = await Users.findOne({
    email: req.body.email
  })
  // console.log('data:', data)
  if (!data) {
    res.json({
      success: false,
      msg: 'user not found'
    })
  }
  else {
    const valid = await bcrypt.compare(req.body.password, data.password)
    if (valid) {
      const payload = {
        username: data._id,
        expires: Date.now() + parseInt(process.env.jwtExpireTime),
      };
      const token = await jwt.sign(payload, process.env.jwtSectret)
      res.json({
        success: true,
        token,
        data: data
      })
    }
    else {
      res.json({
        success: false,
        msg: 'password wrong'
      })
    }
  }
}

exports.buyBooks = async function (req, res) {
  try {
    if (req.body.id && req.body.userId) {
      let data = await Books.updateOne(
        { _id: mongoose.Types.ObjectId(req.body.id) },
        { $inc: { units: -1 } }
      )
      let user = await Users.findOne({
        _id: mongoose.Types.ObjectId(req.body.userId)
      })
      if (data) {
        let purchase = new Purchase({
          book_id: mongoose.Types.ObjectId(req.body.id),
          user_email: user.email
        })
        await purchase.save();
        res.json({
          success: true,
          data
        })
      }
    } else {
      res.json({
        success: false,
        data: []
      })
    }

  } catch (err) {
    console.log('err:', err)
    res.json({
      success: false,
      error: err
    })
  }
}