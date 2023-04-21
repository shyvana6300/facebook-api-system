SELECT 
st.id idStatus,
st.*,
email,
fr.accountId,
idFriend
FROM facebook_api_db.friendships as fr
left join facebook_api_db.accounts as ac
on fr.accountId = ac.id
left join facebook_api_db.statuses as st
on st.accountId = fr.idFriend
where fr.accountId =3
limit 2,1
