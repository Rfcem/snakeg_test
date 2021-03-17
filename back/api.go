package main

import (

    "fmt"
	"net/http"
    "snakeg/db"
    "snakeg/httpgame/handler"


	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"

)

func main() {
    err := db.CreateTables()
    if err != nil {
        fmt.Println("error with the DB comunication: ",err)
    }
	r := chi.NewRouter()
	r.Use(middleware.Logger)

    //Get Players
	r.Get("/", handler.TopPlayersGet())


    // Post a new player or a new score
    r.Post("/", handler.NewPlayerPost())

    fmt.Println("Serving on port :3000")
	http.ListenAndServe(":3000", r)
}
