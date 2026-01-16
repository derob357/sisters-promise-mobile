# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# React Native
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.unicode.** { *; }
-keepclassmembers class ** {
    native <methods>;
}

# React Native Navigation
-keep class com.reactnativenavigation.** { *; }
-keepclassmembers class ** {
    *** *NavigationModule(...);
}

# AsyncStorage
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# Gesture Handler
-keep class com.swmansion.gesturehandler.** { *; }

# Safe Area Context
-keep class com.th3rdwave.safeareacontext.** { *; }

# React Native Screens
-keep class com.swmansion.rnscreens.** { *; }

# Axios/OkHttp
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }
-dontwarn okhttp3.**
-dontwarn okio.**

# Keep all view constructors (used via reflection)
-keepclasseswithmembers class * {
    public <init>(android.content.Context, android.util.AttributeSet);
}

# Keep R classes
-keepclassmembers class **.R$* {
    public static <fields>;
}

# Keep Enum classes
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# Keep custom Application classes
-keep class com.sisterspromisemobile.** { *; }

# Keep classes with annotations
-keep class * {
    @java.lang.Deprecated <methods>;
}

# Optimization flags
-optimizationpasses 5
-dontusemixedcaseclassnames

# Remove logging in release builds
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
}

# Remove debug BuildConfig fields
-assumenosideeffects class com.sisterspromisemobile.BuildConfig {
    public static final boolean DEBUG;
}

# Preserve line numbers for crash reporting
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# Keep exception handling
-keepclassmembers class * {
    public void on*(com.facebook.react.**Event);
}

# Keep view methods called via reflection
-keepclasseswithmembers class * {
    public *** on*(...)
    { return; };
}

# Preserve stack traces
-keepattributes InnerClasses
-keepattributes EnclosingMethod

# Keep methods with native implementation
-keepclasseswithmethodnames class * {
    native <methods>;
}

# UUID library
-keep class java.util.UUID { *; }

# JSON serialization support
-keepclassmembers class * {
    @com.google.gson.annotations.SerializedName <fields>;
}

# Prevent stripping of test classes during build
-dontwarn junit.**
-dontwarn androidx.test.**
