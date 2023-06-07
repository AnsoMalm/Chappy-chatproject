import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

function getDb() {
	const whereWeAre = dirname(fileURLToPath(import.meta.url))
	const file = join(whereWeAre, 'db.json')
	const adapter = new JSONFile(file)
	const db = new Low(adapter, {})
	return db
}

// await db.read()
// console.log(db.data)
export {getDb}