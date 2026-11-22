const Member = require("../models/Member");

// Get all active members
exports.getMembers = async (req, res) => {
  try {
    const members = await Member.find({ isActive: true })
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: members
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get one member
exports.getMemberById = async (req, res) => {
  try {
    const member = await Member.findOne({
      id: req.params.id,
      isActive: true
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found"
      });
    }

    res.status(200).json({
      success: true,
      data: member
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};