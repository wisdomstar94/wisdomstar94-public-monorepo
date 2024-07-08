use gtk4::{self, gdk, gio::ActionEntry, glib, prelude::{ActionMapExtManual, ApplicationExt, ApplicationExtManual, GtkWindowExt, WidgetExt}, Application, ApplicationWindow};

fn build_ui(app: &Application) {
    // Create a window and set the title
    let window = ApplicationWindow::builder()
        .application(app)
        .title("My GTK App")
        .width_request(360)
        .build();

    // Add action "close" to `window` taking no parameter
    let action_close = ActionEntry::builder("close")
        .activate(|window: &ApplicationWindow, _, _| {
            window.close();
        })
        .build();
    window.add_action_entries([action_close]);

    // Present window
    window.present();
}

pub fn run() -> glib::ExitCode {
    gtk4::init().unwrap();

    let application = gtk4::Application::new(
        Some("com.electron_keyboard_event_listener"),
        Default::default(),
    );
    // application.connect_activate();
    // application.run();

    let window = gtk4::ApplicationWindow::builder()
        .application(&application)
        .build();

    let event_controller = gtk4::EventControllerKey::new();

    event_controller.connect_key_pressed(|_, key, _, _| {
        match key {
            gdk::Key::Escape => {
                std::process::exit(0);
            },
            gdk::Key::B => {
                println!("B 누름!");
            },
            gdk::Key::Control_L => {
                println!("Control_L 누름!");
            },
            _ => (),
        }
        glib::Propagation::Proceed
    });

    window.add_controller(event_controller);
    window.present();


    // application.add_action(action)
    application.connect_activate(build_ui);
    application.run()
}
