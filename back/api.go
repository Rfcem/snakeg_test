package main

import (

    "fmt"
	"net/http"
    "strings"
    "snakeg/db"
    "snakeg/httpgame/handler"


	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"

)

func main() {
    // Create if not exist users table in players DB
    err := db.CreateTables()
    if err != nil {
        fmt.Println("error with the DB comunication: ",err)
    }

	r := chi.NewRouter()
	r.Use(middleware.Logger)

    // serve static files
    staticFileDirectory := http.Dir("./static/")
    FileServer(r, "/*", staticFileDirectory)

    r.Route("/api", func(r chi.Router){
        //Get Players
    	r.Get("/TopPlayers", handler.TopPlayersGet())


        // Post a new player or a new score
        r.Post("/TopPlayers", handler.NewPlayerPost())
    })


    fmt.Println("Serving on port :5000")
	http.ListenAndServe(":5000", r)
}

func FileServer(r chi.Router, path string, root http.FileSystem) {


	r.Get(path, func(w http.ResponseWriter, r *http.Request) {
		rctx := chi.RouteContext(r.Context())
		pathPrefix := strings.TrimSuffix(rctx.RoutePattern(), "/*")
		fs := http.StripPrefix(pathPrefix, http.FileServer(root))
		fs.ServeHTTP(w, r)
	})
}
