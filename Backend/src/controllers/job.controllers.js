import { searchJobs, getJobDetails } from '../services/job.service.js';

/**
 * GET /api/jobs/search?query=...&location=...&datePosted=...&jobType=...&remoteOnly=...&page=...
 */
export const searchJobsController = async (req, res) => {
  try {
    const {
      query,
      location,
      datePosted,
      jobType,
      remoteOnly,
      page,
    } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required.' });
    }

    const result = await searchJobs({
      query,
      location,
      datePosted,
      jobType,
      remoteOnly,
      page: Number(page) || 1,
    });

    return res.status(200).json({
      message: 'Jobs fetched successfully.',
      data: result,
    });
  } catch (error) {
    console.error('[searchJobsController] Error:', error.message);
    return res.status(500).json({
      message: error.message || 'Failed to fetch jobs.',
    });
  }
};

/**
 * GET /api/jobs/:jobId
 */
export const getJobDetailsController = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required.' });
    }

    const job = await getJobDetails(jobId);

    return res.status(200).json({
      message: 'Job details fetched successfully.',
      data: job,
    });
  } catch (error) {
    console.error('[getJobDetailsController] Error:', error.message);
    return res.status(500).json({
      message: error.message || 'Failed to fetch job details.',
    });
  }
};
