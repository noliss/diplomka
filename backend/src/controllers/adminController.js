const UserClub = require("../models/UserClub");

exports.getClubMembers = async (req, res) => {
  try {
    const members = await UserClub.getMembersWithGrades(req.params.clubId);
    
    // Добавляем default значения для фронтенда
    const formattedMembers = members.map(member => ({
      id: member.id,
      name: member.name,
      email: member.email,
      grade: member.grade || null, // если оценка не выставлена
      comment: member.comment || '' // если комментария нет
    }));
    
    res.json({ 
      success: true, 
      members: formattedMembers 
    });
  } catch (error) {
    console.error("Ошибка при получении участников:", error);
    res.status(500).json({
      success: false,
      message: "Ошибка при получении списка участников",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
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
    // Проверяем наличие данных
    if (!req.body.grades || !Array.isArray(req.body.grades)) {
      return res.status(400).json({
        success: false,
        message: "Неверный формат данных",
      });
    }

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

    // Добавляем проверку длины комментария (например, не более 500 символов)
    const hasLongComment = req.body.grades.some((item) => {
      return item.comment && item.comment.length > 500;
    });

    if (hasLongComment) {
      return res.status(400).json({
        success: false,
        message: "Комментарий не должен превышать 500 символов",
      });
    }

    await UserClub.updateGrades(req.params.clubId, req.body.grades);
    
    res.json({ 
      success: true,
      message: "Оценки и комментарии успешно обновлены"
    });
  } catch (error) {
    console.error("Ошибка при обновлении оценок:", error);
    res.status(500).json({
      success: false,
      message: "Ошибка при обновлении оценок и комментариев",
    });
  }
};
