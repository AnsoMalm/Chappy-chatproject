

const Login = () => {

	return (
		<div className="user-status">
		{/* <span>Inloggad som VänligaVera</span>
		<button> Logga ut </button> */}
{/* <!-- När man inte är inloggad visas detta i stället: */}
		<input type="text" value="Användarnamn" />
		<input type="password" value="1234" />
		<button> Logga in </button>
	</div>
	)
}

export default Login