# snakeg_test

# <img alt="died" src="/back/static/woof.png"/>

## Description

Woof is a game based on the snake game, but it differs in two points. The first is that in this game you collect gems instead of apples and when you collect a red gem (which is like a ruby) your length decreases by 2, this is normally good but if your length is less or equal than 2 it's game over. The other difference are the bombs, these elements move around the map and every time you collect 10 gems, one of them spawns. Be careful with this because if you collide with them you may die.

## Project setup

To run this project you need install  the 'go' compiler:
``
https://golang.org/dl/
``

The CockroachDB binary:
``
https://www.cockroachlabs.com/docs/v20.2/install-cockroachdb-windows.html
``


## Running the project

##### First you need to create a database following the next steps:

1. Run the cockroach demo command in the command prompt.</br>
`cockroach demo`

2. Take note of the **(sql/tcp)** connection string in the SQL shell welcome text:</br>
`(sql/tcp) postgres://root:admin@127.0.0.1:61011?sslmode=require `</br>
in this example, the port number is `61011`, *in your case may be different*. You will use the port number later to change one line of code.

3. In the SQL shell, create the ***players*** database that the applications need's to store the users and it's scores:</br>
``CREATE DATABASE players;``

4. Create a SQL user:</br>
``CREATE USER username WITH PASSWORD password;``

5. Give the user the necessary permissions:</br>
``GRANT ALL ON DATABASE players TO username;``</br>


##### Running the go code

1. In the project folder, go to the route **``back/db``** and open the **cockroach.go** file.

2. Change ``<db_port_number>`` to the port number you got from  **(sql/tcp)**
```go
func DBConnect() (*pgx.Conn, error) {

    config, err := pgx.ParseConfig(
        "postgres://username:password@127.0.0.1:<db_port_number>/players?sslmode=require")

    if err != nil {
        return nil, err
    }

    config.TLSConfig.ServerName = "localhost"

    // Connect to the "players" database.
    conn, err := pgx.ConnectConfig(context.Background(), config)

    if err != nil {
        return nil, err
    }
    return conn, nil
}
```

3. Go back to the **back** folder and run the code with the following command:</br>
``
go run api.go
``
4. Open your browser and go to:</br>
``
localhost:5000
``

## Screenshots
# <img alt="home_page" src="/Screenshots/home_page.png"/>

# <img alt="playing" src="/Screenshots/playing.png"/>

# <img alt="ruby" src="/Screenshots/ruby.png"/>

# <img alt="died" src="/Screenshots/died.png"/>

# <img alt="about" src="/Screenshots/about.png"/>
