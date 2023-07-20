SELECT email,
accountId,
friend.idFriend
FROM facebook_api_db.accounts as account
right join facebook_api_db.friendships as friend
on account.id = friend.accountId
where friend.accountId =3;