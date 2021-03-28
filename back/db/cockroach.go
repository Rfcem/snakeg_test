package db

import(
    "context"



    "github.com/cockroachdb/cockroach-go/v2/crdb/crdbpgx"
    "github.com/jackc/pgx/v4"
)



func DBConnect() (*pgx.Conn, error) {

    config, err := pgx.ParseConfig(
        "postgres://username:password@127.0.0.1:49300/players?sslmode=require")

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

func CreateTables() error {
    conn, err := DBConnect()
    if err != nil {
        return err
    }

    /*
    close the connection at the end of the execution or in case of any other
    function fails.
    */
    defer conn.Close(context.Background())

    // Create the "users" table
    if _, err := conn.Exec(context.Background(),
        "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name TEXT UNIQUE, score INT NOT NULL, UNIQUE(name, score))");
        err != nil {
            return err
    }


    return nil

}

func GetUserScores() ([]Player ,error) {
    var players []Player
    var position int = 1
    conn, err := DBConnect()
    if  err != nil {
        return players, err
    }

    /*
    close the connection at the end of the execution or in case of any other
    function fails.
    */
    defer conn.Close(context.Background())

    // get users scores
    rows, err := conn.Query(context.Background(),
        "SELECT name, score From users ORDER BY score DESC" )
    if err != nil {
        return players, err
    }

    defer rows.Close()

    for rows.Next(){
        var score int
        var name string
        if err := rows.Scan(&name, &score); err != nil {
            return players, err
        }
        players = append(players, Player{
            Id: position,
            Name: name,
            Score: score,
        })
        position++
    }
    return players, nil
}

func AddOrUpdateDB(ctx context.Context, tx pgx.Tx, user string, score int, players *[]Player ) error {


    var position int = 1

    // Insert or update an user
    if _ ,err := tx.Exec(ctx,
        "INSERT INTO users (name, score) VALUES ($1, $2) ON CONFLICT (name) DO UPDATE SET score =  EXCLUDED.score WHERE users.score <  EXCLUDED.score ",
        user, score); err != nil {
        return err
    }

    // get users scores
    rows, err := tx.Query(context.Background(),
        "SELECT name, score From users ORDER BY score DESC" )
    if err != nil {
        return err
    }

    defer rows.Close()

    for rows.Next(){
        var score int
        var name string
        if err := rows.Scan(&name, &score); err != nil {
            return err
        }
        *players = append(*players, Player{
            Id: position,
            Name: name,
            Score: score,
        })
        position++
    }
    return nil
}

func InsertUaS(player Player) ([]Player ,error) {
    var players []Player

    conn, err := DBConnect()
    if err != nil {
        return players, nil
    }

    // Add users and scores
    if err := crdbpgx.ExecuteTx(context.Background(), conn, pgx.TxOptions{},
        func(tx pgx.Tx) (error) {
            return AddOrUpdateDB(context.Background(), tx, player.Name, player.Score, &players)
        });err != nil {
        return players, err
    }




    return players, nil
}
