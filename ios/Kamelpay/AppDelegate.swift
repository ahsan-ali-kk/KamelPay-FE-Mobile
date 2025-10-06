import UIKit
import Expo
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

import FirebaseCore
import FirebaseMessaging
import UserNotifications

// ✅ Removed `import SplashScreen` because it's Objective-C now
// SplashScreen is imported via Kamelpay-Bridging-Header.h

@main
class AppDelegate: ExpoAppDelegate {
    var window: UIWindow?

    var reactNativeDelegate: ReactNativeDelegate?
    var reactNativeFactory: RCTReactNativeFactory?

    override func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
    ) -> Bool {
        // ✅ Configure Firebase
        FirebaseApp.configure()

        showSplashScreen()

        // ✅ Push Notifications setup
        if #available(iOS 10.0, *) {
            UNUserNotificationCenter.current().delegate = self
            let authOptions: UNAuthorizationOptions = [.alert, .badge, .sound]
            UNUserNotificationCenter.current().requestAuthorization(
                options: authOptions,
                completionHandler: { _, _ in }
            )
        } else {
            let settings = UIUserNotificationSettings(types: [.alert, .badge, .sound], categories: nil)
            application.registerUserNotificationSettings(settings)
        }
        application.registerForRemoteNotifications()

        // ✅ Set FCM delegate
        Messaging.messaging().delegate = self

        // ✅ Existing Expo/React Native setup
        let delegate = ReactNativeDelegate()
        let factory = ExpoReactNativeFactory(delegate: delegate)
        delegate.dependencyProvider = RCTAppDependencyProvider()

        reactNativeDelegate = delegate
        reactNativeFactory = factory
        bindReactNativeFactory(factory)

        window = UIWindow(frame: UIScreen.main.bounds)

        factory.startReactNative(
            withModuleName: "Kamelpay",
            in: window,
            launchOptions: launchOptions
        )

        // ✅ Show splash screen via Objective-C bridging header
      showSplashScreen() // Call directly, bridging header exposes it

        return super.application(application, didFinishLaunchingWithOptions: launchOptions)
    }

    // ✅ Register APNs token for FCM
    override func application(_ application: UIApplication,
                              didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        Messaging.messaging().apnsToken = deviceToken
        super.application(application, didRegisterForRemoteNotificationsWithDeviceToken: deviceToken)
    }

    //Add below method in AppDelegate.swift
    private func showSplashScreen() {
      if let splashClass = NSClassFromString("SplashView") as? NSObject.Type,
          let splashInstance = splashClass.perform(NSSelectorFromString("sharedInstance"))?.takeUnretainedValue() as? NSObject {
          splashInstance.perform(NSSelectorFromString("showSplash"))
          print("✅ Splash Screen Shown Successfully")
      } else {
          print("⚠️ SplashView module not found")
      }
    }
}

// MARK: - Foreground/Background Notification Handling
extension AppDelegate: UNUserNotificationCenterDelegate {
    func userNotificationCenter(_ center: UNUserNotificationCenter,
                                willPresent notification: UNNotification,
                                withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        completionHandler([[.banner, .sound, .badge]])
    }

    func userNotificationCenter(_ center: UNUserNotificationCenter,
                                didReceive response: UNNotificationResponse,
                                withCompletionHandler completionHandler: @escaping () -> Void) {
        completionHandler()
    }
}

// MARK: - Firebase Messaging Delegate
extension AppDelegate: MessagingDelegate {
    func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
        print("🔥 FCM Token: \(fcmToken ?? "")")
        // 👉 Send this token to your backend if needed
    }
}

class ReactNativeDelegate: ExpoReactNativeFactoryDelegate {
    override func sourceURL(for bridge: RCTBridge) -> URL? {
        bridge.bundleURL ?? bundleURL()
    }

    override func bundleURL() -> URL? {
#if DEBUG
        RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: ".expo/.virtual-metro-entry")
#else
        Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
    }
}
