const functions = require('firebase-functions');
const Alexa = require('ask-sdk-core');

exports.alexa = functions.https.onRequest((request, response) => {
//  module.exports.handler(request.body , {}, response);
  module.exports.handler(request.body , {})
    .then(resp_json => {
      response.json(resp_json);
    });
//  console.log(`RESPONSE to client ++++${JSON.stringify(resp_json)}`);
});

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'ガンマン時計を表示します。何色の時計がいいですか？';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const GunClock = require('./GunClock');

const GunclockIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GunclockIntent';
    },
    handle(handlerInput) {

        colorId = handlerInput
                   .requestEnvelope
                   .request
                   .intent
                   .slots
                   .colorslot
                   .resolutions
                   .resolutionsPerAuthority[0]
                   .values[0]
                   .value
                   .id;

       colorDic = {
        "blue":"44ccff",
        "red":"ff4444",
        "yellow":"ffff44",
        "green":"88ff88",
        "white":"ffffff",
        "black":"444444"
       };

       colorJpn = {
        "blue":"青",
        "red":"赤",
        "yellow":"黄",
        "green":"緑",
        "white":"白",
        "black":"黒"
       };

       gunmanImage = {
        "blue":"Gunman.Alexa.2.jpg",
        "red":"Gunman.Alexa.1.jpg",
        "yellow":"Gunman.Alexa.3.jpg",
        "green":"Gunman.Alexa.1.jpg",
        "white":"Gunman.Alexa.2.jpg",
        "black":"Gunman.Alexa.3.jpg"
       };

        const title = 'ガンマン時計 (' + colorJpn[colorId] + ')';
        const backgroundImage = new Alexa.ImageHelper()
//            .addImageInstance('https://s3.amazonaws.com/skill-card-sample/BackgroundImage.jpg')
            .addImageInstance('https://gunman-vagabond.github.io/pic/' + gunmanImage[colorId])
            .getImage();
        const forgroundImage = new Alexa.ImageHelper()
//            .addImageInstance('https://s3.amazonaws.com/skill-card-sample/ForgroundImage.jpg')
            .addImageInstance('https://gunclocks-django.azurewebsites.net/gunclocks/getGunClock/?city=Tokyo&size=18&color=' + colorDic[colorId] + '&fontsize=8&format=jpeg')
            .getImage();


//        gunclock = 
//          'https://script.google.com/macros/s/AKfycbxyreXaAJ4Xyn4QF7tNpUd5LFprjM8v1g8fC4PED66Swd0hhvw/exec?type=text&clocksize=15'

//	var d = new Date();
        var d = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));

	var hour = d.getHours();
	var minute = d.getMinutes();
	var second = d.getSeconds();

        gunclock = GunClock.getGunClock(11, "<br />", hour, minute, second);
        //等倍フォントで表示できないので、この、gunclock は、使わずに、jpeg取得で、行く

        const textContent = new Alexa.RichTextContentHelper()
//            .withPrimaryText('<font size="1">' + gunclock + '</font>')
            .withPrimaryText('<font size="1">現在の時刻は ' + hour + '時' + minute + '分 です。</font>')
//            .withPrimaryText('<font size="1"><table><tr><td bgcolor="#61aaff"><pre>aaa<br />bbb<br />1<br />2<br />3<br /></pre></td></tr></table></font>')
//            .withSecondaryText('<font size="1">SecondaryText</font>')
//            .withTertiaryText('<font size="1">TertiaryText(size=1)<br />2<br />3<br />4</font>')
            .withSecondaryText(' ')
            .withTertiaryText(' ')
            .getTextContent();
        const token = 'TOKEN'

        speakOutput = Alexa.getSlotValue(handlerInput.requestEnvelope, "colorslot") + '時計を表示します。';
        speakOutput += '現在の時刻は' + hour + '時' + minute + '分です。'

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .addHintDirective('hint message')
            .addRenderTemplateDirective({
                type: 'BodyTemplate3',
                backButton: 'VISIBLE',
                backgroundImage: backgroundImage,
                image:  forgroundImage,
                title: title,
                textContent: textContent,
                token : token,
            })
//            .withShouldEndSession(true)
//            .speak('現在の時刻は' + hour + '時' + minute + '分です')
            .getResponse();

    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = '色を指定してください。ガンマン時計を表示します。';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'さようなら';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'もう一度言ってみてください。';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};

const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = intentName + 'で、中断しました';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'もう一度、言ってみてください';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/*--------
let skill;

exports.handler = function (event, context) {
  console.log(`REQUEST++++${JSON.stringify(event)}`);
  if (!skill) {
    skill = Alexa.SkillBuilders.custom()
      .addRequestHandlers(
        LaunchRequestHandler,
        GunclockIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
      .addErrorHandlers(
        ErrorHandler)
      .create();
  }

  const response = skill.invoke(event, context);
  console.log(`RESPONSE++++${JSON.stringify(response)}`);

  return response;
};
-------*/


let skill;

exports.handler = async function (event, context) {
  console.log(`REQUEST++++${JSON.stringify(event)}`);
  if (!skill) {
    skill = Alexa.SkillBuilders.custom()
      .addRequestHandlers(
        LaunchRequestHandler,
        GunclockIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
      .addErrorHandlers(
        ErrorHandler)
      .create();
  }

  const response = await skill.invoke(event, context);
  console.log(`RESPONSE++++${JSON.stringify(response)}`);

//  client_resp.json(response);

  return response;
};


/*
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        GunclockIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
//    .withCustomUserAgent('sample/xxx/v1.2')
    .lambda();
*/