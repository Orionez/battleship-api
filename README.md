# Battleship Game API

## How to run the server
1. Make sure you have Mongodb up and running.
2. Run `npm install` or `yarn install`.
3. Start server by using `npm start` command.
## API
`POST /games` - Create new game, returns Game object

__Request__
```json
{
    "playerName" : "John Doe"
}
```
__Response__
```json
{
    "fieldSize": 10,
    "moves": [],
    "ships": [
        {
            "_id": "5a7b37045f67fe8adfaeee0b",
            "type": "Battleship",
            "health": 4,
            "isSunk": false,
            "id": "5a7b37045f67fe8adfaeee0b"
        },
        {
            "_id": "5a7b37045f67fe8adfaeee0c",
            "type": "Cruiser",
            "health": 3,
            "isSunk": false,
            "id": "5a7b37045f67fe8adfaeee0c"
        },
        {
            "_id": "5a7b37045f67fe8adfaeee0d",
            "type": "Cruiser",
            "health": 3,
            "isSunk": false,
            "id": "5a7b37045f67fe8adfaeee0d"
        },
        {
            "_id": "5a7b37045f67fe8adfaeee0e",
            "type": "Destroyer",
            "health": 2,
            "isSunk": false,
            "id": "5a7b37045f67fe8adfaeee0e"
        },
        {
            "_id": "5a7b37045f67fe8adfaeee0f",
            "type": "Destroyer",
            "health": 2,
            "isSunk": false,
            "id": "5a7b37045f67fe8adfaeee0f"
        },
        {
            "_id": "5a7b37045f67fe8adfaeee10",
            "type": "Destroyer",
            "health": 2,
            "isSunk": false,
            "id": "5a7b37045f67fe8adfaeee10"
        },
        {
            "_id": "5a7b37045f67fe8adfaeee11",
            "type": "Submarine",
            "health": 1,
            "isSunk": false,
            "id": "5a7b37045f67fe8adfaeee11"
        },
        {
            "_id": "5a7b37045f67fe8adfaeee12",
            "type": "Submarine",
            "health": 1,
            "isSunk": false,
            "id": "5a7b37045f67fe8adfaeee12"
        },
        {
            "_id": "5a7b37045f67fe8adfaeee13",
            "type": "Submarine",
            "health": 1,
            "isSunk": false,
            "id": "5a7b37045f67fe8adfaeee13"
        },
        {
            "_id": "5a7b37045f67fe8adfaeee14",
            "type": "Submarine",
            "health": 1,
            "isSunk": false,
            "id": "5a7b37045f67fe8adfaeee14"
        }
    ],
    "_id": "5a7b37045f67fe8adfaeee0a",
    "playerName": "John Doe",
    "__v": 0,
    "id": "5a7b37045f67fe8adfaeee0a"
}
```

`GET /games/:id` - Get game info by game id, returns Game object

`GET /games` - List all games, returns list of Game object.

`POST /games/:id/moves` - Place move on the board, returns move object

__Request__
```json
{
    "rowNumber": 5,
    "columnNumber": 0
}
```
__Response__
```json
{
    "_id": "5a7b37d55f67fe8adfaef139",
    "rowNumber": 5,
    "columnNumber": 0,
    "message": "Hit"
}
```
## Testing
Run test by using `npm test` command.
  - [jest](https://facebook.github.io/jest/) for unit testing. 
  - [supertest](https://github.com/visionmedia/supertest) for integration testing. 

