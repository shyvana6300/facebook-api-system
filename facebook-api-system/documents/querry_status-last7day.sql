SELECT Count(*) FROM facebook_api_db.statuses
where accountId = 3
and updatedAt >= now() - interval 7 day;