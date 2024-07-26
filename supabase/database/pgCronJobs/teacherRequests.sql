-- Author: Laura

-- delete rows older than a week and where approved status is TRUE
SELECT cron.schedule(
               'weekly-request-clean-up',
               '0 3 * * 7',
               $$ DELETE FROM teacher_requests WHERE (created_at < NOW() - INTERVAL '1 week' AND approved = TRUE) $$
       );