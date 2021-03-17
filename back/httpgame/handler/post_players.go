package handler

import(

    "encoding/json"
    "net/http"
    "snakeg/db"

)

func NewPlayerPost() http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request){
        var player1 db.Player
        json.NewDecoder(r.Body).Decode(&player1)
        db.InsertUaS(player1)
        w.Write([]byte("Good job!"))
    }
}
