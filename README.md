# UC Courses Mobile App

[![Build Status][ci-image]][ci-url] [![dependencies][dependencies-image]][dependencies-url] [![dev-dependencies][dev-dependencies-image]][dev-dependencies-url]

Multi-platform mobile app built with [Ionic2](http://ionicframework.com/docs/v2/getting-started/installation), [Angular2](https://angular.io/) and [Typescript](http://www.typescriptlang.org/).

Client of [almapp/uc-courses](https://github.com/almapp/uc-courses)

[![AppStore][appstore-image]][appstore-url]
[![PlayStore][playstore-image]][playstore-url]

## Development

Clone this repository:

```sh
git clone https://github.com/almapp/uc-courses-mobile.git
cd uc-courses-mobile
```

### Dependencies

Make sure you have installed Ionic2 and [Cordova](https://cordova.apache.org):

```sh
npm install -g cordova ionic@beta
```

Project dependencies:

```sh
npm install
```

### Setup API endpoint

By default, the application will try to connect to `http://uc-courses.lopezjuri.com/api/v1`. You can change this value by setting the `API_URL` environment variable.

```sh
export API_URL=http://your.url.com/api/v1
```

### Run

To view both Android and iOS views on the browser:

```sh
npm start
```

To run on an Android device, first you need the Android SDK and allow development options on the device. Then:

```sh
npm run android
```

> See: http://ionicframework.com/docs/v2/getting-started/installation/#building-for-android

### Installing new Cordova plugins

```
ionic plugin add <plugin name>
```

### Releasing

Run:

```sh
npm run release
```

#### Android

The Android `.apk` will be generated at `platforms/android/build/outputs/apk/android-release-unsigned.apk`. To sign it:

```sh
cd platforms/android/build/outputs/apk

# Generate keystore (if you don't have one)
keytool -genkey -v -keystore release.keystore -alias almapp -keyalg RSA -keysize 2048 -validity 10000

# Sign in
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore release.keystore android-release-unsigned.apk almapp

# Build release .apk
rm app.apk; zipalign -v 4 android-release-unsigned.apk app.apk
```

The release .apk is located at: `platforms/android/build/outputs/apk/app.apk` and it's ready to be uploaded to the AppStore.

#### iOS

0. Open `platforms/ios/Cursos UC.xcodeproj` with XCode.
0. Select `Generic iOS Device`
0. Go to `Product -> Archive`

The final product should appear on the `Organizer`.

[appstore-image]: http://mrpatiwi.github.io/app-badges/appstore.png
[appstore-url]: https://itunes.apple.com/cl/app/cursos-uc/id1076219796
[playstore-image]: http://mrpatiwi.github.io/app-badges/playstore.png
[playstore-url]: https://play.google.com/store/apps/details?id=com.almapp.uccourses
[ci-image]: https://travis-ci.org/almapp/uc-courses-mobile.svg
[ci-url]: https://travis-ci.org/almapp/uc-courses-mobile
[dependencies-image]: https://david-dm.org/almapp/uc-courses-mobile.svg
[dependencies-url]: https://david-dm.org/almapp/uc-courses-mobile
[dev-dependencies-image]: https://david-dm.org/almapp/uc-courses-mobile/dev-status.svg
[dev-dependencies-url]: https://david-dm.org/almapp/uc-courses-mobile#info=devDependencies
