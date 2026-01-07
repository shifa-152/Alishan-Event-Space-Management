import Hall from "../models/Hall.js";

// Get all halls
export const getHalls = async (req, res) => {
  try {
    const halls = await Hall.find();
    res.json({ success: true, data: halls });
  } catch (err) {
    console.error("getHalls error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get a single hall
export const getHallById = async (req, res) => {
  try {
    const hall = await Hall.findById(req.params.id);
    if (!hall) {
      return res
        .status(404)
        .json({ success: false, message: "Hall not found" });
    }
    res.json({ success: true, data: hall });
  } catch (err) {
    console.error("getHallById error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create hall
export const createHall = async (req, res) => {
  try {
    const { name, capacity, price1hr, price2hr } = req.body;

    if (!name || !capacity || !price1hr || !price2hr) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const newHall = new Hall({
      name,
      capacity: Number(capacity),
      price1hr: Number(price1hr),
      price2hr: Number(price2hr),
    });

    const savedHall = await newHall.save();
    res.status(201).json({ success: true, data: savedHall });
  } catch (err) {
    console.error("createHall error:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// Update hall
export const updateHall = async (req, res) => {
  try {
    const { name, capacity, price1hr, price2hr } = req.body;

    if (!name || !capacity || !price1hr || !price2hr) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const updatedHall = await Hall.findByIdAndUpdate(
      req.params.id,
      {
        name,
        capacity: Number(capacity),
        price1hr: Number(price1hr),
        price2hr: Number(price2hr),
      },
      { new: true }
    );

    if (!updatedHall) {
      return res
        .status(404)
        .json({ success: false, message: "Hall not found" });
    }

    res.json({ success: true, data: updatedHall });
  } catch (err) {
    console.error("updateHall error:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// Delete hall
export const deleteHall = async (req, res) => {
  try {
    const deletedHall = await Hall.findByIdAndDelete(req.params.id);

    if (!deletedHall) {
      return res
        .status(404)
        .json({ success: false, message: "Hall not found" });
    }

    res.json({ success: true, message: "Hall deleted successfully" });
  } catch (err) {
    console.error("deleteHall error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
