package handler

import(

    "encoding/json"
    "log"
    "net/http"
    "snakeg/db"

)

func TopPlayersGet() http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
    		players, err := db.GetUserScores()
            if err != nil {
                log.Fatal(err)
            }
            json.NewEncoder(w).Encode(players)
	}
}
