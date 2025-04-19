import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Contact } from "../models/contact.models.js";

const createContact = asyncHandler(async (req, res) => {
  const { message, name, email, phone } = req.body;
  const userId = req.user?._id;
  if (!message || !name || !email || !phone)
    throw new ApiError(400, "Every feild is required");

  const contact = await Contact.create({
    user: userId,
    message,
    name,
    email,
    phone,
  });

  if (!contact) throw new ApiError(400, "Error generating it.");

  res
    .status(200)
    .json(new ApiResponse(200, contact, "Problem registered successfully.."));
});



export { createContact };
