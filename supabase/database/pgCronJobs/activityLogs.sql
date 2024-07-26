-- Author: Laura

-- delete logs every day at 3am older than a day
SELECT cron.schedule(
               'daily-xp-logs-cleanup',
               '0 3 * * *',
               $$ DELETE FROM xp_activity_logs WHERE created_at < NOW() - INTERVAL '1 day' $$
       );