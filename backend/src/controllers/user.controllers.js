import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    console.log(accessToken);
    const refreshToken = user.generateRefreshToken();
    console.log(user);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(401, "Token is not generated");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, name, password, street, zipcode, city, phone } = req.body;
  console.log(req.body);
  if (
    [email, name, password, street, zipcode, city, phone].some(
      (field) => field?.trim() === ""
    )
  )
    throw new ApiError(400, "All fields are reqired");

  const existedUser = await User.findOne({ email });
  if (existedUser) throw new ApiError(409, "User with email exists");

  console.log(req.files);
  const avatarLocalPath = req.files?.avatar[0]?.path;
  if (!avatarLocalPath) throw new ApiError(400, "Avatar is required");

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) throw new ApiError(400, "Avatar is required");

  const user = await User.create({
    avatar: avatar.url,
    email,
    password,
    name: name,
    address: [
      {
        street,
        zipcode,
        city,
      },
    ],
    phone,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser)
    return new ApiError(500, "Something went wrong while registering user");
 
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User created successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { password, email } = req.body;

  if (!email) throw new ApiError(400, "Email is reqired");

  const user = await User.findOne({ email });

  if (!user) throw new ApiError(404, "User does not registerd");

  const isPasswordvalid = await user.isPasswordCorrect(password);

  if (!isPasswordvalid) throw new ApiError(401, "Invalid user credentials");

  const { accessToken, refreshToken } = await generateTokens(user._id);

  const loggedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedUser, accessToken, refreshToken },
        "User loggedin Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingToken) throw new ApiError(401, "unauthorized request");
  try {
    const decoded = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET);
    if (!decoded) throw new ApiError(401, "Invalid refresh token");

    const user = await User.findById(decoded?._id);
    if (!user) throw new ApiError(401, "Refresh token is expired or used");

    const options = {
      httpOnly: true,
      security: true,
    };

    const { accessToken, newRefreshToken } = await generateTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const passwordChange = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) throw new ApiError(401, "Invalid Password");

  console.log(newPassword);
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { street, zipcode, city, phone, email, name } = req.body;

  // Construct the update object based on what is provided in the request body
  const updateObject = {};
  if (street) updateObject["address.0.street"] = street; // Note the '0' index for the array element
  if (zipcode) updateObject["address.0.zipcode"] = zipcode;
  if (city) updateObject["address.0.city"] = city;
  if (phone) updateObject.phone = phone;
  if (email) updateObject.email = email;
  if (name) updateObject.name = name;

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: updateObject,
    },
    { new: true, runValidators: true }
  ).select("-password");

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: updatedUser },
        "Account details updated successfully"
      )
    );
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  console.log(req.file);

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  const oldUser = await User.findById(req.user._id).select("avatar");
  if (!oldUser) {
    throw new ApiError(404, "User not found");
  }

  const oldAvatarUrl = oldUser.avatar;

  const uploadedAvatar = await uploadOnCloudinary(avatarLocalPath);

  if (!uploadedAvatar.url) {
    throw new ApiError(400, "Error while uploading avatar");
  }

  const newAvatarUrl = uploadedAvatar.url;

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { avatar: newAvatarUrl } },
    { new: true, select: "-password" }
  );

  if (oldAvatarUrl) {
    await deleteFromCloudinary(oldAvatarUrl);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: updatedUser },
        "Avatar image updated successfully"
      )
    );
});

const deleteAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");

  await User.findByIdAndDelete(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Account deleted successfully"));
});

//Only admin can update user role
const updateUserRole = asyncHandler(async (req, res) => {
  const { email, newRole } = req.body;

  if (!["admin", "customer", "employee", "supplier"].includes(newRole)) {
    throw new ApiError(400, "Invalid role");
  }
  const userId = await User.findOne({ email }).select("_id");

  const user = await User.findByIdAndUpdate(
    userId,
    { role: newRole },
    { new: true }
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "User role updated"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  passwordChange,
  refreshAccessToken,
  deleteAccount,
  updateUserRole,
};
