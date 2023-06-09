import express from 'express';
import { getDb } from '../data/database.js';
import { isValidId, isValidUser, userExists } from '../utils/validator.js';
import { generateUserId } from '../utils/generateId.js';

const router = express.Router();

const db = getDb();

// Hämta alla användare
router.get('/', async (req, res) => {
  console.log('GET all users: ');
  await db.read();
  let users = db.data.users
  res.send(users);
});

// hämta användare från sitt id
router.get('/:id', async (req, res) => {
  console.log('GET /users/:id');
  if (!isValidId(req.params.id)) {
    res.sendStatus(400);
    console.log('Incorrent value, must be a number for Id..');
    return;
  }
  let id = Number(req.params.id);

  await db.read();
  let mayBeUsers = db.data.users.find(user => user.id === id);
  if (!mayBeUsers) {
    res.sendStatus(404);
    console.log('Could not found the correct id in the list.. ');
    return;
  }
  res.status(200).send(mayBeUsers);
  console.log('Found the correct user..');
});

//Lägga till ny användare
router.post('/', async (req, res) => {
    let mayBeUsers = req.body

    if(isValidUser(mayBeUsers)) {
      await db.read()
        if( await userExists(db.data.users, mayBeUsers.username)) {
          res.sendStatus(409)
          console.log('Användaren finns redan..')
        } else {
          mayBeUsers.id = await generateUserId()
          db.data.users.push(mayBeUsers)
          await db.write()
          res.send(mayBeUsers)
          console.log('post valid')
        }
    }
    else {
      res.sendStatus(400);
      console.log('felsöker, post invalid')
    }
  
})

  router.delete('/:id', async (req, res) => {
      if( !isValidId(req.params.id) ) {
        res.sendStatus(400)
        console.log('Try to delete user, incorrect value...')
        return
      }
      let id = Number(req.params.id)

      await db.read()
      
      let mayBeUsers = db.data.users.find(user => user.id === id)
      if( !mayBeUsers) {
        res.sendStatus(404)
        console.log('Delete user, could not found id in the user-list')
        return
      }
      db.data.users = db.data.users.filter(user => user.id !== id)
      await db.write()
      res.sendStatus(200)
      console.log('Correct, now is the user deleted!')
  })

export default router;