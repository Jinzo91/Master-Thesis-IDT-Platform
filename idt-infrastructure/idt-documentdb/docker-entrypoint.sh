use admin

db.createUser({ user: 'admin', pwd: 'IDTRocks2019!', roles: [ { role: 'userAdminAnyDatabase', db: 'admin',}, 'readWriteAnyDatabase']})



# docker-entrypoint.sh
# "${mongo[@]}" "$ADMINDB" ;-EOJS
# 	db.createUser({
# 		user: $(jq --arg 'user' "$USER" --null-input '$user'),
# 		pwd: $(jq --arg 'pwd' "$PWD" --null-input '$pwd'),
# 		roles: [ { role: 'root', db: $(jq --arg 'db' "$ADMINDB" --null-input '$db') } ]
# 	})
# EOJS