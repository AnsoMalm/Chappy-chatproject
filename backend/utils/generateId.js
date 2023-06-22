import { getDb } from "../data/database.js"

const db = getDb()

async function generateUserId() {
	console.log('Hämtar data: ? ', db.data)
   await db.read()
   const highestId = Number(db.data.users.reduce((maxId, currentUser) => {
	   return Math.max(maxId, currentUser.id) 
   }, 0))

   console.log('Generate: ', highestId)
   
   return highestId + 1 
   
}

// async function generateUniqueId() {
//    await db.read()
//    console.log('Messages:', db.data.messages)
//    if (db.data.messages.length > 0) {
//        const highestMessageId = Number(db.data.messages.reduce((maxId, currentMessages) => {
//            console.log('maxId:', maxId, 'currentMessages.id:', currentMessages.id)
//            return Math.max(maxId, currentMessages.id)
//        }, 0))
       
//        console.log('Generate: ', highestMessageId)
       
//        return highestMessageId + 1
//    } else {
//        return 1
//    }
// }


export {generateUserId}