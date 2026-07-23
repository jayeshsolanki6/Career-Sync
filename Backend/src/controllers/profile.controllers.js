import Profile from '../models/profile.model.js'
import { extractProfileFromResume } from '../services/profile.service.js'
import { extractResumeText } from '../services/upload.service.js'

/**
 * Extract text from uploaded resume, run AI profile extraction, and upsert user profile.
 * @route POST /api/profile/upload
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
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
        experienceYears: extracted.experienceYears ?? 0,
        experienceSummary: extracted.experienceSummary || null,
        targetRoles: extracted.targetRoles || [],
        resumeHealth: extracted.resumeHealth || null,
        lastUpdated: new Date(),
      },
      { upsert: true, new: true }
    )

    // 4. Sync targetRoles onto User document
    if (extracted.targetRoles?.length) {
      const userRoles = req.user.targetRoles || []
      const merged = [...new Set([...userRoles, ...extracted.targetRoles])]
      req.user.targetRoles = merged
      await req.user.save()
    }

    return res.status(200).json({
      message: 'Profile created / updated successfully.',
      data: profile,
    })
  } catch (error) {
    console.error('[uploadProfileController]', error.message)
    return res.status(500).json({ message: error.message || 'Profile upload failed.' })
  }
}

/**
 * Fetch current user profile.
 * @route GET /api/profile
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
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

/**
 * Update skills, target roles, or experience summary manually.
 * @route PUT /api/profile
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const updateProfileController = async (req, res) => {
  try {
    const { skills, targetRoles, experienceSummary } = req.body

    const updates = {}
    if (Array.isArray(skills)) updates.skills = skills
    if (Array.isArray(targetRoles)) updates.targetRoles = targetRoles
    if (experienceSummary !== undefined) updates.experienceSummary = experienceSummary
    updates.lastUpdated = new Date()

    const profile = await Profile.findOneAndUpdate(
      { userId: req.user._id },
      { $set: updates },
      { new: true, upsert: false }
    )

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found. Please upload your resume first.' })
    }

    if (Array.isArray(targetRoles)) {
      req.user.targetRoles = targetRoles
      await req.user.save()
    }

    return res.status(200).json({ message: 'Profile updated.', data: profile })
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to update profile.' })
  }
}
