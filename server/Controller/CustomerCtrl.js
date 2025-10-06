const Customer = require("../Models/CustomerModel");

// CREATE customer
exports.createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ one customer
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    // If 'beat' is sent in the request, map it to 'beats'
    if (req.body.beat) {
      req.body.beats = req.body.beat.map((b) => b.areaName);
      delete req.body.beat; // Optional: clean up unwanted key
    }

    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE customer
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json({ message: "Customer deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllBeats = async (req, res) => {
  try {
    const beats = await Customer.aggregate([
      {
        $match: {
          area: { $exists: true, $ne: null }, // area null नहीं होनी चाहिए
        },
      },
      {
        $group: {
          _id: "$area", // ✅ area ke hisab se group karo
        },
      },
      {
        $project: {
          areaName: "$_id.name", // area ke name
          areaId: "$_id._id", // area ki ID
          _id: 0, // _id remove kar do
        },
      },
    ]);

    res.json({
      message: "Beats fetched successfully",
      count: beats.length,
      beats,
    });
  } catch (err) {
    console.error("getAllBeats error:", err);
    res.status(500).json({ error: err.message });
  }
};
