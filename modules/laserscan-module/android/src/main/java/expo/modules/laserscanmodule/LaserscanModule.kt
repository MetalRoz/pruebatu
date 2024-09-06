package expo.modules.laserscanmodule

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import com.rscja.barcode.BarcodeDecoder
import com.rscja.barcode.BarcodeFactory
import com.rscja.deviceapi.entity.BarcodeEntity
import android.app.Activity

class LaserscanModule : Module() {

  private val barcodeDecoder: BarcodeDecoder = BarcodeFactory.getInstance().barcodeDecoder

  override fun definition() = ModuleDefinition {
    Name("LaserscanModule")

    Constants("PI" to Math.PI)

    Events("onScanSuccess", "onScanFailed")

    Function("initializeScanner") {
      initializeScanner()
    }

    Function("startScan") {
      startScan()
    }

    Function("stopScan") {
      stopScan()
    }

    View(LaserscanModuleView::class) {
      Prop("name") { view: LaserscanModuleView, prop: String ->
        println(prop)
      }
    }
  }

  private fun getCurrentActivity(): Activity? {
    return appContext?.currentActivity
  }

  private fun initializeScanner() {
    getCurrentActivity()?.let { activity ->
      barcodeDecoder.open(activity)
      barcodeDecoder.setDecodeCallback { barcodeEntity ->
        if (barcodeEntity.resultCode == BarcodeDecoder.DECODE_SUCCESS) {
          sendEvent("onScanSuccess", mapOf("data" to barcodeEntity.barcodeData))
        } else {
          sendEvent("onScanFailed", mapOf("error" to "Decode failed"))
        }
      }
    } ?: run {
      sendEvent("onScanFailed", mapOf("error" to "No activity found"))
    }
  }

  private fun startScan() {
    try {
      barcodeDecoder.startScan()
    } catch (e: Exception) {
      sendEvent("onScanFailed", mapOf("error" to "Failed to start scan: ${e.message}"))
    }
  }

  private fun stopScan() {
    try {
      barcodeDecoder.stopScan()
    } catch (e: Exception) {
      sendEvent("onScanFailed", mapOf("error" to "Failed to stop scan: ${e.message}"))
    }
  }

  private fun closeScanner() {
    try {
      barcodeDecoder.close()
    } catch (e: Exception) {
      sendEvent("onScanFailed", mapOf("error" to "Failed to close scanner: ${e.message}"))
    }
  }
}

