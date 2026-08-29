use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_sql::Builder::default().build())
    .setup(|app| {
      // Clear WebKitGTK disk cache on launch so updated UI bundles always load fresh
      if let Ok(data_dir) = app.path().app_local_data_dir() {
        let webkit_cache = data_dir.join("WebKitCache");
        if webkit_cache.exists() {
          let _ = std::fs::remove_dir_all(&webkit_cache);
        }
      }

      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
