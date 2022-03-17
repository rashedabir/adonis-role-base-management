// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from "@ioc:Adonis/Core/Hash";
import User from "App/Models/User";
const jwt = require("jsonwebtoken");

export default class AuthController {
  public async signup({ request, response }) {
    const name = request.input("name");
    const email = request.input("email");
    const password = request.input("password");

    if (!name || !email || !password) {
      return response.status(400).json({ msg: "invalid credential" });
    }
    if (password.length < 4) {
      return response
        .status(400)
        .json({ msg: "Password must be 4 digit long" });
    }

    const existingMail: any = await User.find(email);
    if (existingMail) {
      return response.status(400).json({ msg: "This Email is Already Exists" });
    }

    const payload = {
      name: name,
      email: email,
      password: await Hash.make(password),
    };

    await User.create(payload);
    const token = jwt.sign({ id: payload.email }, "123456789", {
      expiresIn: "1d",
    });

    response.cookie("bareer", token, {
      expires: new Date(),
      path: "/bareer",
      secure: false,
    });

    return response.ok({ token: token });
  }

  public async login({ request, response }) {
    const email = request.input("email");
    const password = request.input("password");

    if (!email || !password) {
      return response.status(400).json({ msg: "invalid credential" });
    }
    if (password.length < 4) {
      return response
        .status(400)
        .json({ msg: "Password must be 4 digit long" });
    }

    const user: any = await User.find(email);
    if (!user) {
      return response.status(400).json({ msg: "This Email is Not Exists" });
    }

    const matchPass = await Hash.verify(user.password, password);
    if (!matchPass) {
      return response.status(400).json({ msg: "Password Not Matched" });
    }

    const token = jwt.sign({ id: user.email }, "123456789", {
      expiresIn: "1d",
    });

    response.cookie("bareer", token, {
      expires: new Date(),
      path: "/bareer",
      secure: false,
    });

    return response.ok({ token: token });
  }
}
