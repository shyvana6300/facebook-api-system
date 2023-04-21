select * from facebook_api_db.statuses as status
right join 
(SELECT email,
accountId,
idFriend
FROM facebook_api_db.accounts as account
right join facebook_api_db.friendships as friend
on account.id = friend.accountId
where friend.accountId =3) as listFriend
on status.accountId = listFriend.idFriend;