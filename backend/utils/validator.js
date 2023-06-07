
function isValidId(user) {
	let mayBeId = Number(user)
	if(isNaN(mayBeId) ) {
		return false 
	}
	return mayBeId >= 0 
}

export { isValidId }