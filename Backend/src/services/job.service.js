import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const JSEARCH_BASE_URL = 'https://jsearch.p.rapidapi.com';

const jsearchClient = axios.create({
  baseURL: JSEARCH_BASE_URL,
  headers: {
    'x-rapidapi-host': 'jsearch.p.rapidapi.com',
    'x-rapidapi-key': process.env.JSEARCH_API_KEY,
  },
});

/**
 * Search for jobs using JSearch API
 * @param {Object} options
 * @param {string} options.query        - Search query (e.g. "React Developer")
 * @param {string} [options.location]   - Location filter (e.g. "New York")
 * @param {string} [options.datePosted] - Filter: all | today | 3days | week | month
 * @param {string} [options.jobType]    - Filter: fulltime | parttime | contractor | intern
 * @param {string} [options.remoteOnly] - "true" | "false"
 * @param {number} [options.page]       - Page number (default: 1)
 * @param {number} [options.numPages]   - Number of pages to fetch (default: 1)
 * @returns {Promise<Object>}
 */
export const searchJobs = async ({
  query,
  location = '',
  datePosted = 'all',
  jobType = '',
  remoteOnly = 'false',
  page = 1,
  numPages = 1,
} = {}) => {
  if (!query) throw new Error('Search query is required.');

  const params = {
    query: location ? `${query} in ${location}` : query,
    page: String(page),
    num_pages: String(numPages),
    date_posted: datePosted,
    remote_jobs_only: remoteOnly,
  };

  if (jobType) params.employment_types = jobType.toUpperCase();

  const response = await jsearchClient.get('/search', { params });

  const rawJobs = response.data?.data || [];

  return {
    status: response.data?.status,
    total: response.data?.data?.length || 0,
    jobs: rawJobs.map(normalizeJob),
  };
};

/**
 * Get full details for a specific job by ID
 */
export const getJobDetails = async (jobId) => {
  if (!jobId) throw new Error('Job ID is required.');

  const response = await jsearchClient.get('/job-details', {
    params: { job_id: jobId, extended_publisher_details: 'false' },
  });

  const job = response.data?.data?.[0];
  if (!job) throw new Error('Job not found.');

  return normalizeJob(job);
};

/**
 * Normalize raw JSearch job object to a cleaner schema
 */
const normalizeJob = (job) => ({
  id: job.job_id,
  title: job.job_title,
  company: job.employer_name,
  companyLogo: job.employer_logo || null,
  location: job.job_city
    ? `${job.job_city}${job.job_state ? `, ${job.job_state}` : ''}${job.job_country ? `, ${job.job_country}` : ''}`
    : job.job_country || 'Remote',
  isRemote: job.job_is_remote || false,
  employmentType: job.job_employment_type || 'N/A',
  description: job.job_description || '',
  applyLink: job.job_apply_link || '',
  postedAt: job.job_posted_at_datetime_utc || null,
  expiresAt: job.job_offer_expiration_datetime_utc || null,
  salary: {
    min: job.job_min_salary || null,
    max: job.job_max_salary || null,
    currency: job.job_salary_currency || 'USD',
    period: job.job_salary_period || null,
  },
  requiredSkills: job.job_required_skills || [],
  requiredExperience: job.job_required_experience
    ? {
        months: job.job_required_experience.required_experience_in_months,
        mentionedInText: job.job_required_experience.experience_mentioned,
      }
    : null,
  publisher: job.job_publisher || '',
  highlights: {
    qualifications: job.job_highlights?.Qualifications || [],
    responsibilities: job.job_highlights?.Responsibilities || [],
    benefits: job.job_highlights?.Benefits || [],
  },
});
