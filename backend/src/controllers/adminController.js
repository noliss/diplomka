const UserClub = require("../models/UserClub");

exports.getClubMembers = async (req, res) => {
  try {
    const members = await UserClub.getMembersWithGrades(req.params.clubId);
    res.json({ success: true, members });
  } catch (error) {
    console.error("Ошибка при получении участников:", error);
    res.status(500).json({
      success: false,
      message: "Ошибка при получении списка участников",
    });
  }
};

exports.deleteClub = async (req, res) => {
  try {
    const clubId = req.params.clubId;
    const deletedCount = await UserClub.deleteClub(clubId);

    if (deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Кружок не найден",
      });
    }

    res.json({
      success: true,
      message: "Кружок успешно удален",
    });
  } catch (error) {
    console.error("Ошибка при удалении кружка:", error);
    res.status(500).json({
      success: false,
      message: "Ошибка при удалении кружка",
    });
  }
};

exports.updateGrades = async (req, res) => {
  try {
    // Проверяем, что все оценки в диапазоне 1-5
    const hasInvalidGrade = req.body.grades.some((item) => {
      return item.grade < 1 || item.grade > 5;
    });

    if (hasInvalidGrade) {
      return res.status(400).json({
        success: false,
        message: "Оценка должна быть в диапазоне от 1 до 5",
      });
    }

    await UserClub.updateGrades(req.params.clubId, req.body.grades);
    res.json({ success: true });
  } catch (error) {
    console.error("Ошибка при обновлении оценок:", error);
    res.status(500).json({
      success: false,
      message: "Ошибка при обновлении оценок",
    });
  }
};
