emulator -avd Pixel_9 -no-snapshot


externalNativeBuild {
        cmake {
            def cmakeDir = "${android.sdkDirectory}/cmake/4.1.2/bin"
            def ninjaExecutable = "ninja.exe" 
            def ninjaPath = "${cmakeDir}/${ninjaExecutable}".replace("\\", "/")

            arguments "-DCMAKE_MAKE_PROGRAM=${ninjaPath}",
                        "-DCMAKE_OBJECT_PATH_MAX=1024"
        }
        
}


adb uninstall com.ritik.expensetracker