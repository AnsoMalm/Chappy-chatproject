
function isValidUser(u) {
	if ((typeof u) !== 'object' || u === null) {
		return false
	}
	
	let nameIsValid = (typeof u.username) === 'string'
	nameIsValid = nameIsValid && u.username !== ''

	let passwordIsValid = (typeof u.password) === 'string'
	passwordIsValid = passwordIsValid && u.password !== ''

	if(!nameIsValid || !passwordIsValid ) {
		return false
	}
	return true
}


function isValidId(user) {
	let mayBeId = Number(user)
	if(isNaN(mayBeId) ) {
		return false 
	}
	return mayBeId >= 0 
}

async function userExists(users, username) {
	for (let i = 0; i < users.length; i++) {
		if(users[i].username === username ) {
			return true;
		}
	}
	return false

}

export { isValidUser, isValidId, userExists  }