use actix_web::{App, HttpResponse, HttpServer, Responder, get, middleware::Logger};
use env_logger::Env;

#[get("/")]
async fn hello() -> impl Responder {
    println!("Request to / endpoint");
    HttpResponse::Ok().body("Hello World!")
}

#[get("/ping")]
async fn ping() -> impl Responder {
    println!("Request to /ping endpoint");
    HttpResponse::Ok().body("pong")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Initialize logger
    env_logger::init_from_env(Env::default().default_filter_or("info"));

    println!("Starting server at http://0.0.0.0:8081");
    HttpServer::new(|| {
        App::new()
            .wrap(Logger::new("%r %s %D ms")) // Log format: request, status, duration
            .service(hello)
            .service(ping)
    })
    .bind("0.0.0.0:8081")?
    .run()
    .await
}
