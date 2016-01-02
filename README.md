# Buscacursos UC

Multi-platform mobile app built with [Ionic2](http://ionicframework.com/docs/v2/getting-started/installation), [Angular2](https://angular.io/) and [Typescript](http://www.typescriptlang.org/).

Client of [almapp/uc-courses](https://github.com/almapp/uc-courses)

## Development

Clone this repository:

```sh
git clone https://github.com/almapp/buscacursos-uc-mobile.git
cd buscacursos-uc-mobile
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
