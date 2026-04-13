import LearningItem from '../models/learning.model.js';
import { generateLearningRoadmap } from '../services/learning.service.js';
import { getCoursesForSkill } from '../services/course.service.js';

export const addSkillToLearningList = async (req, res) => {
  try {
    const { skillName } = req.body;
    if (!skillName) {
      return res.status(400).json({ success: false, message: 'Skill name is required' });
    }

    // Check if already in queue
    const existing = await LearningItem.findOne({ userId: req.user._id, skillName });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Skill already in your learning queue' });
    }

    const newItem = await LearningItem.create({
      userId: req.user._id,
      skillName,
      status: 'To Learn',
    });

    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLearningList = async (req, res) => {
  try {
    const items = await LearningItem.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const generateRoadmap = async (req, res) => {
  try {
    const { skillName, links } = req.body;

    if (!skillName || !links || links.length === 0) {
      return res.status(400).json({ success: false, message: 'Skill name and links are required' });
    }

    // Call service to generate roadmap
    const roadmapMarkdown = await generateLearningRoadmap(skillName, links);

    // Save roadmap to the LearningItem
    const item = await LearningItem.findOneAndUpdate(
      { userId: req.user._id, skillName },
      { roadmap: roadmapMarkdown },
      { new: true }
    );

    if (!item) {
      // If item doesn't exist, maybe they generated without saving? 
      // Safest is to just return the roadmap anyway.
      return res.status(200).json({ success: true, data: { roadmap: roadmapMarkdown } });
    }

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeSkillFromLearningList = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await LearningItem.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Learning item not found' });
    }

    res.status(200).json({ success: true, message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/learning/courses/:skill
 * Get course recommendations for a specific skill.
 */
export const getCoursesForSkillController = async (req, res) => {
  try {
    const { skill } = req.params;

    if (!skill || !skill.trim()) {
      return res.status(400).json({ message: 'Skill name is required.' });
    }

    const courses = getCoursesForSkill(skill);

    if (!courses) {
      return res.status(404).json({
        message: `No courses found for "${skill}".`,
        skill_name: skill,
      });
    }

    return res.status(200).json({
      message: 'Courses found.',
      data: courses,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Failed to fetch course recommendations.',
    });
  }
};
