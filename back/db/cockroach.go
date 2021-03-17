package db

import(
    "context"



    "github.com/cockroachdb/cockroach-go/v2/crdb/crdbpgx"
    "github.com/jackc/pgx/v4"
)



func DBConnect() (*pgx.Conn, error) {

    config, err := pgx.ParseConfig(
        "postgres://deso_kanoe:yuuk0_12@127.0.0.1:57631/players?sslmode=require")

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
        "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name TEXT UNIQUE)");
        err != nil {
            return err
    }

    // Create the "scores" table
    if _, err := conn.Exec(context.Background(),
        "CREATE TABLE IF NOT EXISTS scores (id SERIAL PRIMARY KEY, user_id INT NOT NULL, score INT NOT NULL, CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE, UNIQUE(user_id, score))");
        err != nil {
            return err
    }

    return nil

}

func GetUserScores() ([]Player ,error) {
    var players []Player

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
        "SELECT users.name, scores.score From users JOIN scores ON users.id = scores.user_id ORDER BY scores.score DESC" )
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
            Name: name,
            Score: score,
        })
    }
    return players, nil
}

func AddOrUpdateDB(ctx context.Context, tx pgx.Tx, user string, score int) error {

    var user_id int

    // Insert or ignore a new user


    if _ ,err := tx.Exec(ctx,
        "INSERT INTO users (name) VALUES ($1) ON CONFLICT (name) DO NOTHING",
        user); err != nil {
        return err
    }

    // get the current user_id

    if err := tx.QueryRow(ctx,
        "SELECT id FROM users WHERE name = $1",
        user).Scan( &user_id );err != nil {
        return err
    }

    // Insert a new score for the current user
    if _ , err := tx.Exec(ctx,
        "INSERT INTO scores (user_id, score) VALUES ($1, $2) ON CONFLICT DO NOTHING",
        user_id, score);err != nil {
        return err
    }

    return nil
}

func InsertUaS(player Player) error {
    if (player.Name == "" || player.Score == 0) {
        return nil
    }
    conn, err := DBConnect()
    if err != nil {
        return err
    }

    // Add users and scores
    if err := crdbpgx.ExecuteTx(context.Background(), conn, pgx.TxOptions{},
        func(tx pgx.Tx) error {
            return AddOrUpdateDB(context.Background(), tx, player.Name, player.Score)
        });err != nil {
        return err
    }




    return nil
}
