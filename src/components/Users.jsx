// import { useEffect, useState } from "react"
// import { getUsers } from "../ApiFunctions/Users.js"

// function Users() {
// 	const [errorMessage, setErrorMessage] = useState('')
// 	const [users, setUsers] = useState([])
// 	// const [username, setUserName] = useState('')
// 	// const [userPassword, setUserPassword] = useState('')

// 	useEffect(() => {
// 		async function fetchData() {
// 			const usersData = await getUsers()
// 			setUsers(usersData)
// 		}
// 		fetchData()
// 	}, [])
// 	console.log(users)

// 	return (
// 		<nav>
// 		<ul>
// 			<h3 title="Direktmeddelanden"> [DM] </h3>
// 			{users.map(user => (
// 				<li className="user" key={user.id}>
// 					<p>{user.username}</p> 
// 				</li>
// 			))}
// 		</ul>
// 	</nav>
// 	)
// }

// export default Users