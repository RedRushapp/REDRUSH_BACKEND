const pool = require("../config/db");

const getString = (...values) => {
  const value = values.find((item) => typeof item === "string" && item.trim());
  return value ? value.trim() : "";
};

// Public endpoint: any passerby can report an accident without an account.
const createAccidentReport = async (req, res) => {
  try {
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const description = getString(req.body.description);
    const reporter_phone = getString(req.body.reporter_phone, req.body.reporterPhone);

    if (latitude === undefined || latitude === null || longitude === undefined || longitude === null) {
      return res.status(400).json({ message: "Location (latitude and longitude) is required" });
    }

    const [result] = await pool.query(
      "INSERT INTO accident_reports (latitude, longitude, description, reporter_phone) VALUES (?, ?, ?, ?)",
      [latitude, longitude, description || null, reporter_phone || null]
    );

    // Simple version: return all active drivers/managers/admins as contacts.
    // No distance filtering yet since driver/manager/admin location data isn't tracked.
    const [contacts] = await pool.query(
      "SELECT id, full_name, phone, role FROM users WHERE role IN ('driver', 'manager', 'admin') AND status = 'active'"
    );

    res.status(201).json({
      report: { id: result.insertId, latitude, longitude, description, reporter_phone },
      contacts
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit accident report", error: error.message });
  }
};

module.exports = { createAccidentReport };
