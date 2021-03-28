package handler

import(

    "encoding/json"
    "fmt"
    "net/http"
    "snakeg/db"

)

func TopPlayersGet() http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
    		players, err := db.GetUserScores()
            if err != nil {
                fmt.Println(err)
            }
            json.NewEncoder(w).Encode(players)
	}
}
