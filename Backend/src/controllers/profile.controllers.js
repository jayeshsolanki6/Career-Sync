import Profile from '../models/profile.model.js'
import { extractProfileFromResume } from '../services/profile.service.js'
import { extractResumeText } from '../services/upload.service.js'


export const uploadProfileController = async (req, res) => {
  try {
    const resumeFile = req.files?.resume?.[0]
    if (!resumeFile) {
      return res.status(400).json({ message: 'Resume file is required.' })
    }

    // 1. Extract text from PDF / DOCX / DOC
    const resumeText = await extractResumeText(resumeFile)
    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({ message: 'Could not extract text from the uploaded file.' })
    }

    // 2. Run AI extraction (skills, experience, health, roles)
    const extracted = await extractProfileFromResume(resumeText)

    // 3. Upsert the profile (one per user)
    const profile = await Profile.findOneAndUpdate(
      { userId: req.user._id },
      {
        userId: req.user._id,
        resumeText,
        resumeFileName: resumeFile.originalname || null,
        skills: extracted.skills || [],
        experienceSummary: extracted.experienceSummary || null,
        targetRoles: extracted.targetRoles || [],
        resumeHealth: extracted.resumeHealth || null,
      },
      { upsert: true, new: true }
    )

    return res.status(200).json({
      message: 'Profile created / updated successfully.',
      data: profile,
    })
  } catch (error) {
    console.error('[uploadProfileController]', error.message)
    return res.status(500).json({ message: error.message || 'Profile upload failed.' })
  }
}


export const getProfileController = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user._id }).select('-resumeText')
    return res.status(200).json({
      message: 'Profile fetched.',
      data: profile || null,
    })
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to fetch profile.' })
  }
}


export const updateProfileController = async (req, res) => {
  try {
    const { skills, targetRoles, experienceSummary } = req.body

    const updates = {}
    if (Array.isArray(skills)) updates.skills = skills
    if (Array.isArray(targetRoles)) updates.targetRoles = targetRoles
    if (experienceSummary !== undefined) updates.experienceSummary = experienceSummary

    const profile = await Profile.findOneAndUpdate(
      { userId: req.user._id },
      { $set: updates },
      { new: true, upsert: false }
    )

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found. Please upload your resume first.' })
    }

    return res.status(200).json({ message: 'Profile updated.', data: profile })
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to update profile.' })
  }
}
