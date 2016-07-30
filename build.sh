#!/usr/bin/env bash

cordova build --release android

cd platforms/android/build/outputs/apk

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore android-release-unsigned.apk alias_name

zipalign -f -v 4 android-release-unsigned.apk BeanSpells.apk

cd ../../../../
