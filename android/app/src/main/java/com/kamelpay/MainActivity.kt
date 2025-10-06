package com.kamelpay

import android.os.Bundle
import expo.modules.ReactActivityDelegateWrapper
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

import com.splashview.SplashView  // 👈 correct import for react-native-splash-view

class MainActivity : ReactActivity() {

  override fun onCreate(savedInstanceState: Bundle?) {
    SplashView.showSplashView(this) // 👈 correct usage
    super.onCreate(savedInstanceState)
  }

  override fun getMainComponentName(): String = "Kamelpay"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
    ReactActivityDelegateWrapper(
      this,
      BuildConfig.IS_NEW_ARCHITECTURE_ENABLED,
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
    )
}
