import express from "express";

import db from "../db.js";

const router = express.Router();

router.get("/", (req, res) => {
  if (req.session.userId) {
    return res.json({
      valid: true,
      userName: req.session.name,
      userId: req.session.userId,
      vendor: req.session.vendor,
      shopId: req.session.shopId,
      userPhoto: req.session.userPhoto,
    });
  } else {
    return res.json({ valid: false });
  }
});
//LOGIN[POST]
router.post("/login", (req, res) => {
  const login = req.body;
  const sql = "SELECT * FROM User where email = ? AND password = ?";
  db.query(sql, [login.email, login.password], (e, r) => {
    if (e) return res.json({ message: e.message });
    if (r.length > 0) {
      req.session.name = r[0].firstName;
      req.session.userId = r[0].user_id;
      req.session.vendor = r[0].vendor;
      req.session.shopName = r[0].shop_name;
      req.session.userPhoto = r[0].photo;
      req.session.shopLogo = r[0].shop_logo;
      console.log(req.session.email);
      return res.json({ loggedIn: true });
    } else {
      console.log("LOGIN FAIL");
      return res.json({ loggedIn: false });
    }
  });
});

//SIGN-UP[POST]
router.post("/signup", (req, res) => {
  const reg = req.body;
  const sql =
    "INSERT INTO User (`email`, `password`, `firstName`, `lastName`, `photo`, `address`, `phone`, `NID`, `vendor`, `shop_name`, `shop_logo`) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
  const values = [
    reg.email,
    reg.password,
    reg.firstName,
    reg.lastName,
    reg.photo,
    reg.address,
    reg.phone,
    reg.NID,
    reg.vendor === "1" ? 1 : 0,
    reg.shop_name,
    reg.shop_logo,
  ];

  console.log(values);
  db.query(sql, values, (e, r) => {
    if (e) return r.json({ message: e.message });
    return res.json(r);
  });
});

export default router;
