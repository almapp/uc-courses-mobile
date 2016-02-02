# Buscacursos UC

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
