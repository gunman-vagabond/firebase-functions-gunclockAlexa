# GunClock Skill on Alexa

Gunclock Skill's backend for Alexa Skills Kit (ASK) SDK.
Deploy to Google Cloud Functions with FireBase.

## usage

- deploy to Firebase

  $ firebase login
  $ mkdir gunclockAlexa
  $ cd gunclockAlexa
  $ firebase init functions
  
  $ cd functions
  $ npm install --save ask-sdk-model
  $ npm install --save ask-sdk-core
  
  $ cd ..
  $ firebase deploy --only functions

- Alexa Developer Console (EndPoint Setting)

  https://us-central1-XXXXXXXXXX.cloudfunctions.net/alexa

