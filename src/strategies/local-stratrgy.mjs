import passport from "passport";
import { Strategy } from "passport-local";
import mockUsers from "../utils/database.mjs";
import User from "../schema/user.mjs";

passport.serializeUser((user, done) => {
  console.log(`Inside Serialize User`);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log(`Inside Deserialize User`);
  console.log(`Deserialize User: ${id}`);
  try {
    const findUser = await User.findById(id);
    if (!findUser) throw new Error("User Not Found");
    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const findUser = await User.findOne({ username });
      if (!findUser) throw new Error("User Not Found");
      if (findUser.password !== password) throw new Error("Wrong Password");
      done(null, findUser);
    } catch (err) {
      done(err, null);
    }
  })
);
