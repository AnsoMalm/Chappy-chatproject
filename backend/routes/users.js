import express from 'express';
import { getDb } from '../data/database.js';
import { isValidId, isValidUser, userExists, hasId } from '../utils/validator.js';
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
    res.status(400).send({
      message: "Incorrect value - must be a number for id, try again!"
    })
    console.log('Incorrect value, must be a number for Id..');
    return;
  }
  let id = Number(req.params.id);

  await db.read();
  let mayBeUsers = db.data.users.find(user => user.id === id);
  if (!mayBeUsers) {
    res.status(404).send({
      message: "Could not found correct id in the list."
    })
    console.log('Could not found correct id in the list.. ');
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
          res.status(409).send({
            message: "Användaren finns redan, var vänligen välj annat användarnamn eller lösenord."
          })
          console.log('Användaren finns redan..')
        } else {
          mayBeUsers.id = await generateUserId()
          db.data.users.push(mayBeUsers)
          await db.write()
          res.status(200).send({
            message: "Nu är du tillagd!"
          })
          console.log('post is valid')
        }
    }
    else {
      res.status(400).send({
        message: "Du har glömt att fylla i användarnamn eller lösenord, var vänligen att fylla i tack. "
      });
      console.log('felsöker, post is invalid')
    }
  
})

//Ta bort en användare
  router.delete('/:id', async (req, res) => {
      if( !isValidId(req.params.id) ) {
        res.status(400).send({
          message: "Try to delete user but it was incorrect value."
        })
        console.log('Try to delete user, incorrect value...')
        return
      }
      let id = Number(req.params.id)

      await db.read()
      
      let mayBeUsers = db.data.users.find(user => user.id === id)
      if( !mayBeUsers) {
        res.status(404).send({
          message: "Could not delete users, could not found id."
        })
        console.log('Delete user, could not found id in the user-list')
        return
      }
      db.data.users = db.data.users.filter(user => user.id !== id)
      await db.write()
      res.status(200).send({
        message: "Nu är användaren borttagen."
      })
      console.log('Correct, now is the user deleted!')
  })

  router.put('/:id', async (req, res) => {
      if(!isValidId(req.params.id) ) {
        res.status(400).send({
          message: "Incorrect value, has to be a number for id"
        })
          console.log('Incorrect value, had to be a number for id..')
          return
      }
      let id = Number(req.params.id)
      if(!isValidUser(req.body) || !hasId) {
      res.status(400).send({
        message: "Incorrect value, try again! Must be username and password.."
      })
        console.log('Incorrect value, must be username and password.')
        return
    }

      let editTheUser = req.body 
      await db.read()
      let oldUserIndex = db.data.users.findIndex(user => user.id === id)
      if(oldUserIndex === -1) {
        res.status(404).send({
          message: "Could not found the id to change users."
        })
          console.log('Could not found the id to change the users..')
          return
      }
      editTheUser.id = id
      db.data.users[oldUserIndex] = editTheUser
      await db.write()
      res.status(200).send({
        message: "Congrats - you have now change in users!"
      })
      console.log('Now is the users changed..')
  })

export default router;