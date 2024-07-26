-- Author: Laura

-- Delete old cron.job_run_details records of the current user every day at noon
SELECT cron.schedule('delete-job-run-details', '0 12 * * *',
                     $$DELETE FROM cron.job_run_details WHERE end_time < now() - interval '7 days'$$);