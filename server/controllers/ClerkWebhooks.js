import User from "../models/User";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
  try {
    // Create a svix instance with clerk webhook secret
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    // Getting headers
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // Verifying Headers
    await whook.verify(JSON.stringify(req.body), headers);

    // getting Data from request body
    const { data, type } = req.body;

    const userData = {
      _id: data.id,
      email: data.email_adresses[0].email_adresses,
      username: data.fist_name + " " + data.last_name,
      image: data.image_url,
    };

    // switch cases for different Events
    switch (type) {
      case "user.created": {
        await User.create(userData);
        break;
      }

      case "user.Updated": {
        await User.findByAndUpdate(data.id, userData);
        break;
      }

      case "user.deleted": {
        await User.findByAndDelete(data.id);
        break;
      }

      default:
        break;
    }
  res.json({success: true, message: "webhook Recieved"})

  } catch (error) {
    console.log(error.message);
    res.json({success: false, message: error.message});
  }
};

export default clerkWebhooks;
