// ios/CarScene.swift
import Foundation
import CarPlay

class CarSceneDelegate: UIResponder, CPTemplateApplicationSceneDelegate {
  func templateApplicationScene(_ templateApplicationScene: CPTemplateApplicationScene, didConnect interfaceController: CPInterfaceController) {
                                  
    if let applicationDelegate = UIApplication.shared.delegate as? AppDelegate {
    
      if applicationDelegate.bridge == nil {
      
        print("CarPlay cold start - initializing RCT Bridge")

        applicationDelegate.bridge = RCTBridge.init(delegate: applicationDelegate, launchOptions: [:])
        
        applicationDelegate.rootView = RCTRootView.init(
            bridge: applicationDelegate.bridge!,
            moduleName: "Jellify",
            initialProperties: nil
        )

        applicationDelegate.window = UIWindow(frame: UIScreen.main.bounds)

        let rootViewController = UIViewController()

        rootViewController.view = applicationDelegate.rootView

        applicationDelegate.window?.rootViewController = rootViewController
        applicationDelegate.window?.makeKeyAndVisible()
      }
    }                            
    
    print("CarPlay connected, attaching to module")
    RNCarPlay.connect(with: interfaceController, window: templateApplicationScene.carWindow);
  }

  func templateApplicationScene(_ templateApplicationScene: CPTemplateApplicationScene, didDisconnectInterfaceController interfaceController: CPInterfaceController) {
  
    RNCarPlay.disconnect()
    
  }
}
