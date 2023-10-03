
const User = require('../models/User.model');
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");


const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);
async function verifyGoogleToken(token) {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID,
        });
        return { payload: ticket.getPayload() };
    } catch (error) {
        return { error: "Invalid user detected. Please try again" };
    }
}



const authUser = async (req, res) => {
    try {
        if (req.body.credential) {
            const verificationResponse = await verifyGoogleToken(req.body.credential);

            if (verificationResponse.error) {
                return res.status(400).json({
                    message: verificationResponse.error,
                });
            }

            const profile = verificationResponse?.payload;
            let user = await User.findOne({ email: profile?.email });

            if (!user) {
                user = new User({
                    googleId: profile?.sub,
                    firstName: profile?.given_name,
                    lastName: profile?.family_name,
                    picture: profile?.picture,
                    email: profile?.email,
                });

                await user.save();
            }

            const token = jwt.sign({ email: profile?.email }, process.env.JWT_SECRET, {
                expiresIn: "1d",
            });

            res.status(201).json({
                message: user ? "Login was successful" : "Signup was successful",
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    picture: user.picture,
                    email: user.email,
                    token,
                },
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "An error occurred. Authentication failed.",
        });
    }
}


module.exports = {
    authUser
}