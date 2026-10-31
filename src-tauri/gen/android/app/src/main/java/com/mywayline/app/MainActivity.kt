package com.mywayline.app

import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import androidx.core.graphics.Insets
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import android.view.View
class MainActivity : TauriActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    enableEdgeToEdge()
    super.onCreate(savedInstanceState)
    applyImeInsets()
  }

  /**
     * Resize the webview when the soft keyboard opens (#33).
     *
     * In edge-to-edge mode (enableEdgeToEdge above; enforced anyway on Android
     * 15+ at targetSdk 35+) the framework never resizes the window for the IME,
     * so the manifest's adjustResize is inert — and the web layer cannot
     * compensate because wry's WebView doesn't report the keyboard through
     * visualViewport (tauri-apps/tauri#10631). Consume the IME inset here and
     * apply it as bottom padding on the content view: the webview genuinely
     * shrinks, the page sees the resize, and the frontend's --keyboard-offset
     * tracker correctly computes 0.
     */
    private fun applyImeInsets() {
      val content = findViewById<View>(android.R.id.content)
      ViewCompat.setOnApplyWindowInsetsListener(content) { view, insets ->
        val imeBottom = insets.getInsets(WindowInsetsCompat.Type.ime()).bottom
        view.setPadding(view.paddingLeft, view.paddingTop, view.paddingRight, imeBottom)
        // Strip the IME inset before it reaches the webview so no Chromium
        // version double-applies it; system-bar insets pass through untouched.
        WindowInsetsCompat.Builder(insets)
          .setInsets(WindowInsetsCompat.Type.ime(), Insets.NONE)
          .build()
      }
    }
}
