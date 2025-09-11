const express = require("express");
const router = express.Router();
const customerController = require("../Controller/CustomerCtrl");

router.post("/", customerController.createCustomer);
router.get("/", customerController.getAllCustomers);
router.get("/beats", customerController.getAllBeats);
router.get("/:id", customerController.getCustomerById);
router.put("/:id", customerController.updateCustomer);
router.delete("/:id", customerController.deleteCustomer);

module.exports = router;
