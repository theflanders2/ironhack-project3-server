# Gameodex

https://gameodex.netlify.app

## Description

Gameodex is a site where you can create a personal index of Playstation console games you have played, are currently playing or would like to play. Along with keeping track of games, you can add games to the database, as well as leave comments on games that other members of the site can also see.

## Main Functionalities

- User creation via sign up form
- Authentication using JSON Web Token (JWT)
- Registered users can log in
  Logged in users can:
- Add game, including cover art, to database
- Added games are automatically added to user’s “games contributed” list
- Edit game information including picture
- Add game to “games played” list
- Add game to “currently playing” list
- Add game to “wishlist”
- Leave a comment on a game
- View comment of another user
- Edit own comments
- Delete own comments
- Edit profile

## Backlog

- Email authentication
- Stripe (payment service for donation purposes)
- React-Select for multi-select
- Multilingual support

## Technologies Used

- Server
- Express.js
- REST API
- Node.js
- Mongoose
- MongoDB
- Cloudinary
- JSON Web Token
- Bcrypt
- Render (deployment)
- Mongo DB Atlas (database deployment)

# Project Structure

## Models

User Model
```javascript
{
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  prestigeLevel: { type: String, default: "Recently discovered gaming." },
  avatarUrl: { type: String, default: "" },
  comments: [ { type: Schema.Types.ObjectId, ref: 'Comment' } ],
  gamesContributed: [ { type: Schema.Types.ObjectId, ref: 'Game' } ],
  gamesPlayed: [ { type: Schema.Types.ObjectId, ref: 'Game' } ],
  gamesCurrentlyPlaying: [ { type: Schema.Types.ObjectId, ref: 'Game' } ],
  wishlist: [ { type: Schema.Types.ObjectId, ref: 'Game' } ]
}
```

Game Model
```javascript
{
  name: { type: String, required: true },
  releaseYear: { type: Number, required: true },
  genre: { type: String, required: true },
  coverArtUrl: { type: String, required: false },
  platform: { type: String, enum: ["PSOne", "PS2", "PS3", "PS4", "PS5"], required: true },
  contributedById: { type: Schema.Types.ObjectId, ref: 'User' },
  contributedByUser: { type: String, required: true},
  comments: [ { type: Schema.Types.ObjectId, ref: 'Comment' } ]
}
```

Comment Model
```javascript
{
  game: { type: Schema.Types.ObjectId, ref: "Game" },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  content: { type: String, required: true }
}
```

## Middleware

- isAuthenticated (JWT middleware)

## Routes

| Path                      | Component                      | Permissions                 | Behavior                                                      |
| ------------------------- | ------------------------------ | --------------------------- | ------------------------------------------------------------- |
| `/`                       | HomePage                       | public `<Route>`            | GET Home page                                                 |
| `/auth/signup`            | SignupPage                     | anon only `<AnonRoute>`     | POST Signup form, link to login, navigate to login after      |
| `/auth/login`             | LoginPage                      | anon only `<AnonRoute>`     | POST Login form, link to signup, navigate to homepage after   |
| `/auth/verify`            | n/a                            | user only `<PrivateRoute>`  | GET Verifies user during login process                        |
| `/logout`                 | n/a                            | user only `<PrivateRoute>`  | Detroys token, navigate to homepage after logout              |
| `/api/users`              | n/a                            | user only `<PrivateRoute>`  | GET all users                                                 |
| `/api/users/:userId`      | ProfilePage, UserDetailsPage   | user only `<PrivateRoute>`  | GET a single user                                             |
| `/api/users/:userId`      | EditProfilePage                | user only `<PrivateRoute>`  | PUT update a user's profile                                   |
| `/api/games`              | HomePage, GamesListPage        | user only `<PrivateRoute>`  | GET all games                                                 |
| `/api/games/:gameId`      | GameDetailsPage                | user only `<PrivateRoute>`  | GET single game                                               |
| `/api/games/upload`       | EditGamePage                   | user only `<PrivateRoute>`  | POST upload game cover art                                    |
| `/api/games`              | AddGame                        | user only `<PrivateRoute>`  | POST create game                                              |
| `/api/games/:gameId`      | EditGamePage                   | user only `<PrivateRoute>`  | PUT update game's details                                     |
| `/api/games/:gameId/add-to-games-played`             | UserProfile                    | user only `<PrivateRoute>`  | PUT add game to list                                          |
| `/api/games/:gameId/remove-from-games-played`             | UserProfile                    | user only `<PrivateRoute>`  | PUT remove game from list                                     |
| `/api/games/:gameId/add-to-games-currently-playing`             | UserProfile                    | user only `<PrivateRoute>`  | PUT add game to list                                          |
| `/api/games/:gameId/remove-from-games-currently-playing`             | UserProfile                    | user only `<PrivateRoute>`  | PUT remove game from list                                     |
| `/api/games/:gameId/add-to-wishlist`             | UserProfile                    | user only `<PrivateRoute>`  | PUT add game to list                                          |
| `/api/games/:gameId/remove-from-wishlist`             | UserProfile                    | user only `<PrivateRoute>`  | PUT remove game from list                                     |
| `/api/comments/:commentId`| GameDetailsPage, ProfilePage   | user only `<PrivateRoute>`  | GET a single comment                                          |
| `/api/comments`           | AddComment, GameDetailsPage    | user only `<PrivateRoute>`  | POST create a comment                                         |
| `/api/comments/:commentId`| EditCommentPage                | user only `<PrivateRoute>`  | PUT update a comment                                          |
| `/api/comments/:commentId`| ProfilePage                    | user only `<PrivateRoute>`  | DELETE a comment                                              |

## States

- Non-registered user
- Registered User

## Links

- [Trello Link] (https://trello.com/b/mQz0dVtV/ironhack-project-3)
- [Github Repository Link] (https://github.com/theflanders2/ironhack-project3-server)
- Deployment Link (https://gameodex.netlify.app)

## Contributors / Team

[Kenneth Flanders] (https://github.com/theflanders2)
