import { Router } from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  passwordChange,
  refreshAccessToken,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  deleteAccount,
  updateUserRole,
  getAllUsers,
  fetchSuppliers,
    fetchCustomers,
    fetchEmployees,
    fetchAdmins,
} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { isAdmin, verifyJWT } from "../middlewares/auth.middlewares.js";
import { createContact } from "../controllers/contact.controllers.js";


const router = Router();

router
  .route("/register")
  .post(upload.fields([{ name: "avatar", maxCount: 1 }]), registerUser);
router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, passwordChange);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);

router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
  router.route("/contact").post(verifyJWT, createContact)

router.route("/delete-account").delete(verifyJWT, deleteAccount);
router.route("/update-role").patch(verifyJWT, isAdmin, updateUserRole);
router.route("/all-users").get(verifyJWT, isAdmin, getAllUsers);
router.route("/suppliers").get(verifyJWT, isAdmin, fetchSuppliers);
router.route("/customers").get(verifyJWT, isAdmin, fetchCustomers);
router.route("/employees").get(verifyJWT, isAdmin, fetchEmployees);
router.route("/admins").get(verifyJWT, isAdmin, fetchAdmins);


export default router;
