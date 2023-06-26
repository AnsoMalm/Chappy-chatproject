# ChappyChat API

## Introduction 
-----------------

#### Welcome to my Chappy-Chat-Api project!

#### My name is Ann-Sophie Malmqvist and i have created a API for a chat-app for users. 

#### It contains usersdata, messagesdata and channels and you can use this API for get the data, change it, delete and add users and message in all channels. 
------------------

### The Following information is a guide to se how use the this Chat-API. 
_____
## Datamodellering

|Object      | Property   | Datatype      | Description                            |
|:-----------|:-----------|:--------------|:---------------------------------------|
|**User**	 | id         | number        | users id                               |
|			 | username	  | string 		  | users name                             |
|			 | password	  | string 		  | users password                         |
|**Channel** | id         | number        | channel id                             |
|            | name       | string        | channel name                           |
|            | public     | boolean       | open or closed channel (true or false) | 
|**Message** | id         | number        | users id                               |
|            | channelsid | number        | channels id                            | 
|            | author     | string        | users name                             | 
|            | content    | string        | users textmessage                      |
|            | timestamp  | string        | date and time for send message         |



## API-request
|Name         | Method   | Endpoints                                     | Description                          |
|:------------|:---------|:----------------------------------------------|:-------------------------------------|
|**Users**    | GET      | /api/users			                         | get all users                        |
|             | GET      | /api/users/:id	                             | get a specifik users with id         |
|             | POST     | /api/users/	                                 | create new user                      |
|             | DELETE   | /api/users/:id	                             | delete users                         |
|             | PUT      | /api/users/:id	                             | change users                         |
|**Messages** | GET      | /api/messages	                             | get all messages                     |
|**Channels** | GET      | /api/channels	                             | get all channels                     |
|             | GET      | /api/channels/:channelId                      | get specifik messages from a channel |
|             | POST     | /api/channels/:channelId/messages             | create message in a channel          |
|             | DELETE   | /api/channels/:channelID/messages/:messagesId | delete message                       |
|             | PUT      | /api/channeld/:channelId/messages/:messagesId | change message                       |
|**Login**    | POST     | /api/login	                                 | send login request                   |
