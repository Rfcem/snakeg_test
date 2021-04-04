package handler

import(

    "encoding/json"
    "fmt"
    "net/http"
    "snakeg/db"

)

func NewPlayerPost() http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request){
        var player1 db.Player
        json.NewDecoder(r.Body).Decode(&player1)
        if (player1.Name == "" || player1.Score == 0) {
            players, err := db.GetUserScores()
            if err != nil {
                fmt.Println(err)
                http.Error(w, "[]", http.StatusTeapot)
		        return
            }
            json.NewEncoder(w).Encode(players)
        } else {
            players, err := db.InsertUaS(player1)
            if err != nil {
                fmt.Println(err)
                http.Error(w, "[]", http.StatusInternalServerError)
		        return
            }
            json.NewEncoder(w).Encode(players)
        }

    }
}
