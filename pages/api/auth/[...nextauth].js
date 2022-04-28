import NextAuth from "next-auth";
import bcrypt from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../models/user.model";
import dbConnect from "../../../libs/dbConnect";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "jay enterprise",
      credentials: {
        email: {
          label: "email address",
          type: "email",
          placeholder: "John Doe",
        },
        password: {
          type: "password",
          label: "password",
          placeholder: "please enter your password",
        },
      },
      authorize: async (credentials) => {
        await dbConnect();
        const { email, password } = credentials;

        let user = await User.findOne({ email });
        if (!user) return null;

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return null;
        return user;
      },
    }),
  ],
  callback: {
    jwt: (token, user) => {
      if (token) {
        token.id = user._id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
      }
      return token;
    },
    session: (session, token) => {
      if (session) {
        session.id = token.id;
        session.firstName = token.firstName;
        session.lastName = token.lastName;
      }
      return session;
    },
  },
  secret: "token",
  jwt: {
    secret: "secret",
    encrypt: true,
  },
});
