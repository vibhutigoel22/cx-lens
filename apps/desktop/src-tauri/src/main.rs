// Coralogix Lens desktop shell: starts the local engine API (127.0.0.1 only) and opens a native window on it.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::{net::TcpListener, process::{Child, Command}, sync::Mutex, time::Duration};
use tauri::{Manager, WebviewUrl, WebviewWindowBuilder};

struct Engine(Mutex<Option<Child>>);
const APP_NAME: &str = "Coralogix Lens";

fn free_port() -> u16 { TcpListener::bind("127.0.0.1:0").and_then(|l| l.local_addr()).map(|a| a.port()).unwrap_or(4319) }

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let res = app.path().resource_dir()?.join("server");
            let port = free_port();
            let token: String = (0..48).map(|_| format!("{:x}", rand::random::<u8>() % 16)).collect();
            // Uses the Node.js (>= 20) on PATH. See README › Packaging to bundle Node as a sidecar instead.
            let child = Command::new("node")
                .arg(res.join("api/server.js"))
                .env("CXLENS_PORT", port.to_string())
                .env("CXLENS_TOKEN", &token)
                .env("CXLENS_UI_DIR", res.join("ui"))
                .env("CXLENS_RULES_DIR", res.join("rules"))
                .env("CXLENS_SKILLS_DIR", res.join("skills"))
                .spawn()
                .map_err(|e| format!("{APP_NAME} needs Node.js 20+ on PATH to run its local engine: {e}"))?;
            app.manage(Engine(Mutex::new(Some(child))));
            for _ in 0..50 { if std::net::TcpStream::connect(("127.0.0.1", port)).is_ok() { break; } std::thread::sleep(Duration::from_millis(100)); }
            let url = format!("http://127.0.0.1:{port}/");
            WebviewWindowBuilder::new(app, "main", WebviewUrl::External(url.parse().unwrap()))
                .title(APP_NAME).inner_size(1280.0, 860.0).min_inner_size(900.0, 640.0).build()?;
            Ok(())
        })
        .on_window_event(|w, e| if let tauri::WindowEvent::Destroyed = e { if let Some(mut c) = w.state::<Engine>().0.lock().unwrap().take() { let _ = c.kill(); } })
        .run(tauri::generate_context!())
        .expect("error while running Coralogix Lens");
}
