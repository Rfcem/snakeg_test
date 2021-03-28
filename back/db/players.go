package db


// Player is an entry for one player
type Player struct {
    Id int `json:"id"`
    Name string `json:"name"`
    Score int `json:"score"`
}
