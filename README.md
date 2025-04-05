![Jellify App Icon](assets/icon_dark_60pt_3x.png)
# 🪼 Jellify

[![publish-beta](https://github.com/anultravioletaurora/Jellify/actions/workflows/publish-beta.yml/badge.svg?branch=main)](https://github.com/anultravioletaurora/Jellify/actions/workflows/publish-beta.yml)

### 🔗 Quick Links
[Discord Server](https://discord.gg/yf8fBatktn)

[TestFlight](https://testflight.apple.com/join/etVSc7ZQ)

### ℹ️ About

> **jellify** (verb) - *to make gelatinous* <br>
[see also](https://www.merriam-webster.com/dictionary/jellify)

*Jellify* is a free and open source music player for [Jellyfin](https://jellyfin.org/). Built with [React Native](https://reactnative.dev/), *Jellify* provides a user experience that feels familar to other popular music apps and a has featureset to match

> *Jellify* requires a connection to a [Jellyfin](https://jellyfin.org/) server to work.

### 🤓 Background
I was after a music app for Jellyfin that showcased my music with artwork, had a user interface congruent with what the big guys do, and had the ability to algorithmically curate music (not that you have to use *Jellify* that way). I also wanted to create a music app that could handle my extremely large music libraries (i.e., 100K+ songs) and not get bogged down. 

This app was designed with me and my dad in mind, since I wanted to give him a sleek, one stop shop for live recordings of bands he likes (read: the Grateful Dead). The UI was designed so that he'd find it instantly familiar and useful. CarPlay / Android Auto support was also a must for us, as we both use CarPlay religiously. 

**TL;DR** Designed to be lightweight and scalable, *Jellify* caters to those who want a mobile Jellyfin music experience similar to what's provided by the big music streaming services. 

## 💡 Features
### ✨ Current
- Available via Testflight and Android APK
  - APKs are associated with each [release](https://github.com/anultravioletaurora/Jellify/releases)
- Light and Dark modes
- Home screen access to previously played tracks, artists, and your playlists
- Quick access to similar artists and items for discovering music in your library
- Jellyfin playback reporting and [Last.FM Plugin](https://github.com/jesseward/jellyfin-plugin-lastfm) support
- Library of Favorited Music, not too dissimilar to how streaming services handle your 'library'
- Full playlist support, including creating, updating, and reordering

### 🛠 Roadmap
- [Offline Playback](https://github.com/anultravioletaurora/Jellify/issues/10)
- [CarPlay / Android Auto Support](https://github.com/anultravioletaurora/Jellify/issues/5)
- [Support for Jellyfin Instant Mixes](https://github.com/anultravioletaurora/Jellify/issues/50)
- [Shared, Public, and Collaborative Playlists](https://github.com/anultravioletaurora/Jellify/issues/175)
- [Web / Desktop support](https://github.com/anultravioletaurora/Jellify/issues/71)
- [Watch (Apple Watch / WearOS) Support](https://github.com/anultravioletaurora/Jellify/issues/61)
- [TV (Android, Samsung) Support](https://github.com/anultravioletaurora/Jellify/issues/85)

## 👀 Lemme see!
### Home
Home

<img src="screenshots/home.png" alt="Jellify Home" width="275" height="600">

### Library
Library

<img src="screenshots/library.png" alt="Library" width="275" height="600">

Library Artists

<img src="screenshots/library_artists.png" alt="Library Artists" width="275" height="600">

Artist

<img src="screenshots/artist.png" alt="Artist" width="275" height="600">

Similar Artists

<img src="screenshots/artist_similarto.png" alt="Similar Artists" width="275" height="600">

Album

<img src="screenshots/album.png" alt="Album" width="275" height="600">

Album Artists

<img src="screenshots/album_artists.png" alt="Album Artists" width="275" height="600">

Track Options
 
<img src="screenshots/track_options.png" alt="Track Options" width="275" height="600">

Playlist

<img src="screenshots/playlist.png" alt="Playlist" width="275" height="600">

### Search
<img src="screenshots/search.png" alt="Search" width="275" height="600">

### Player
<img src="screenshots/player.png" alt="Player" width="275" height="600">

<img src="screenshots/player_queue.png" alt="Queue" width="275" height="600">

<img src='screenshots/favorite_track.png' alt='Favorite Track' width='275' height='600”'>

### CarPlay (Sneak Preview)
<img src="screenshots/carplay_nowplaying.jpeg" alt="Now Playing (CarPlay)" width="500" height="350">

### On the Server
<img src="https://github.com/user-attachments/assets/741884a2-b9b7-4081-b3a0-6655d08071dc" alt="Playback Tracking" width="300" height="200">

## 🏗 Built with:
### 🎨 Frontend
[Tamagui](https://tamagui.dev/)\
[React Navigation](https://reactnavigation.org/)\
[React Native Vector Icons](https://github.com/oblador/react-native-vector-icons)
- Specifically Material Community Icons

[React Native CarPlay](https://github.com/birkir/react-native-carplay)\
[React Native Blurhash](https://github.com/mrousavy/react-native-blurhash)

### 🎛️ Backend
[Jellyfin SDK](https://typescript-sdk.jellyfin.org/)\
[Tanstack Query](https://tanstack.com/query/latest/docs/framework/react/react-native)\
[React Native Track Player](https://github.com/doublesymmetry/react-native-track-player)\
[React Native MMKV](https://github.com/mrousavy/react-native-mmkv)\
[React Native File Access](https://github.com/alpha0010/react-native-file-access)

### 👩‍💻 Monitoring
[GlitchTip](https://glitchtip.com/)

### 💜 Love from Wisconsin 🧀
This is undoubtedly a passion project of [mine](https://github.com/anultravioletaurora), and I've learned a lot from working on it (and the many failed attempts before it). I hope you enjoy using it! Feature requests and bug reports are welcome :)

## 🏃‍♀️Running Locally

#### Universal Dependencies
- Ruby
- NodeJS

#### iOS Instructions
- Clone this repository
- Run `npm run init` to initialize the project
  - This will install `npm` packages, install `bundler` and required gems, and installs CocoaPods
- In the `ios` directory, run `fastlane match development --readonly` to fetch the development signing certificates
  - You will need access to the *Jellify Signing* private repository
- To run locally, run `npm run start` then run the app on your device or in the simulator
  - Make sure you open the `Jellify.xcodeworkspace`, *not* the `Jellify.xcodeproject`
- To create a build, run `npm run fastlane:ios:build` to use fastlane to compile an `.ipa` for you

#### Android Instructions
- Clone this repository
- Run `npm i` to install `npm` packages
- To run locally, run `npm run start`, then run the app on your devvice or in the emulator
- To create a build, run `npm run fastlane:android:build` to use fastlane to compile an `.apk` for you  

## 🙏 Special Thanks To
- The [Jellyfin Team](https://jellyfin.org/) for making this possible with their software, SDKs, and unequivocal helpfulness. 
  - Special thanks to [Niels](https://github.com/nielsvanvelzen) and [Bill](https://github.com/thornbill)
- [James](https://github.com/jmshrv) and all other contributors of [Finamp](https://github.com/jmshrv/finamp). *Jellify* draws inspiration and wisdom from it, and is another fantastic music app for Jellyfin. 
  - James’ [API Blog Post](https://jmshrv.com/posts/jellyfin-api/) proved to be exceptionally valuable during development
- The folks in the [Margelo Community Discord](https://discord.com/invite/6CSHz2qAvA) for their assistance
- My dear friends that have heard me talk about *Jellify* for literally **eons**. Thank you for testing *Jellify* during it's infancy and for supporting me all the way back at the beginning of this project 
  - Tony (iOS, Android)
  - Trevor (Android)
  - [Laine](https://github.com/lainie-ftw) (Android)  
  - [Jordan](https://github.com/jordanbleu) (iOS)
- My best(est) friend [Alyssa](https://www.instagram.com/uhh.lyssarae?igsh=MTRmczExempnbjBwZw==), for your design knowledge and for making various artwork for *Jellify*. You’ve been instrumental in shaping it’s user experience
