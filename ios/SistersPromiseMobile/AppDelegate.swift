import UIKit
import React

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  // UserDefaults key to optionally override the Metro dev server host in DEBUG.
  // Set this in Settings app (if you add a Settings.bundle) or via code:
  // UserDefaults.standard.set("192.168.1.10", forKey: "DebugDevServerHost")
  private let debugDevServerHostKey = "DebugDevServerHost"

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    // Create a placeholder bridge and root view.
    let bridge = RCTBridge(delegate: self, launchOptions: launchOptions)
    let rootView = RCTRootView(bridge: bridge!, moduleName: "SistersPromiseMobile", initialProperties: nil)

    rootView.backgroundColor = UIColor.systemBackground

    let window = UIWindow(frame: UIScreen.main.bounds)
    let rootViewController = UIViewController()
    rootViewController.view = rootView
    window.rootViewController = rootViewController
    self.window = window
    window.makeKeyAndVisible()

    return true
  }
}

extension AppDelegate: RCTBridgeDelegate {
  func sourceURL(for bridge: RCTBridge!) -> URL! {
    #if DEBUG
    // Prefer a host from UserDefaults, otherwise default to localhost.
    let host = (UserDefaults.standard.string(forKey: debugDevServerHostKey)?.trimmingCharacters(in: .whitespacesAndNewlines))
    let effectiveHost = (host?.isEmpty == false) ? host! : "localhost"

    func metroURL(bundleRoot: String) -> URL? {
      var comps = URLComponents()
      comps.scheme = "http"
      comps.host = effectiveHost
      comps.port = 8081
      comps.path = "/\(bundleRoot).bundle"
      comps.queryItems = [
        URLQueryItem(name: "platform", value: "ios"),
        URLQueryItem(name: "dev", value: "true"),
        URLQueryItem(name: "minify", value: "false")
      ]
      return comps.url
    }

    // Try manual Metro URLs first for common entry points.
    let manualCandidates = ["index", "index.ios", "main"]
    for root in manualCandidates {
      if let url = metroURL(bundleRoot: root) {
        return url
      }
    }

    // Present a visible error view and return nil.
    showBundleMissingErrorView()
    return nil

    #else
    // Release: use pre-bundled file
    let url = Bundle.main.url(forResource: "main", withExtension: "jsbundle")
    return url
    #endif
  }

  private func showBundleMissingErrorView() {
    guard let window = self.window else {
      return
    }
    let vc = UIViewController()
    vc.view.backgroundColor = UIColor.systemBackground

    let label = UILabel()
    label.numberOfLines = 0
    label.textAlignment = .center
    label.textColor = .label
    label.text = """
    No JS bundle URL could be resolved.

    • Make sure Metro is running: npx react-native start
    • If not on localhost, set the packager host in Settings (DebugDevServerHost)
      or via code: UserDefaults.standard.set("<your-hostname-or-ip>", forKey: "DebugDevServerHost")
    • Confirm your entry file (index.js/tsx) exists.

    See Xcode console logs for more details.
    """
    label.translatesAutoresizingMaskIntoConstraints = false

    vc.view.addSubview(label)
    NSLayoutConstraint.activate([
      label.centerXAnchor.constraint(equalTo: vc.view.centerXAnchor),
      label.centerYAnchor.constraint(equalTo: vc.view.centerYAnchor),
      label.leadingAnchor.constraint(greaterThanOrEqualTo: vc.view.leadingAnchor, constant: 24),
      label.trailingAnchor.constraint(lessThanOrEqualTo: vc.view.trailingAnchor, constant: -24)
    ])

    window.rootViewController = vc
    window.makeKeyAndVisible()

  }
}
