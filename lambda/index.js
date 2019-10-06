// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        PickedAnimalIndex = Math.floor(Math.random() * Data.length);
        PickedAnimal = Data[PickedAnimalIndex].name;

        facts = Data[PickedAnimalIndex].facts;
        const introToProceed = '<audio src="https://alexa-skills-hackathon-wildlife.s3-ap-southeast-2.amazonaws.com/raw/introsound-proceed.mp3"/>';

        const speakOutput = '<audio src="soundbank://soundlibrary/air/fire_extinguisher/fire_extinguisher_01"/>';
        const repromptOutput = "Are you up to the task?";
        
        return handlerInput.responseBuilder
            .speak(introToProceed)
            .reprompt(repromptOutput)
            .getResponse();
    }
};

const ChickenIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ChickenIntent';
    },
    handle(handlerInput) {
        const speakOutput = '<audio src="https://alexa-skills-hackathon-wildlife.s3-ap-southeast-2.amazonaws.com/raw/exit.mp3"/>';
        const repromptOutput = 'Yeah someone is a chicken';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
            .withShouldEndSession(true)
            .getResponse();
    }
};

const StartGameIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'StartGameIntent';
    },
    handle(handlerInput) {
        const speakOutput = '<audio src="https://alexa-skills-hackathon-wildlife.s3-ap-southeast-2.amazonaws.com/raw/gamestart.mp3"/>' + switchVoice(facts.pop()) + switchVoice(". What is your guess or next clue?");
        const repromptOutput = "i did not hear you";
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
            .getResponse();
    }
};

const NextFactIntentHandler = {
    canHandle(handlerInput) {
        // console.log("NextFactIntentHandler");
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'NextFactIntent';
    },
    handle(handlerInput) {
        if (facts.length === 1) {
        const speakOutput = '<audio src="https://alexa-skills-hackathon-wildlife.s3-ap-southeast-2.amazonaws.com/raw/nofacts.mp3"/>' + switchVoice("You lost. The animal is a ") + switchVoice(PickedAnimal) + switchVoice(". Did you know that it ") + switchVoice(facts.pop()) + switchVoice(". See you next time");
        const repromptOutput = "sorry";
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
            .withShouldEndSession(true)
            .getResponse();
        } else {
        const speakOutput = '<audio src="https://alexa-skills-hackathon-wildlife.s3-ap-southeast-2.amazonaws.com/raw/readnextfact.mp3"/>' + switchVoice(facts.pop()) + switchVoice(". What is your guess or next clue?");
        const repromptOutput = "sorry";
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
            .getResponse();
        }
    }
};

const GuessCaptureIntentHandler = {
    canHandle(handlerInput) {

        const guessedAnimal = handlerInput.requestEnvelope.request.intent.slots.animal.value;
        // const guessedAnimal = getSlotValue(handlerInput.requestEnvelope, 'animal');

        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GuessCaptureIntent'
            && guessedAnimal !== null;
    },
    handle(handlerInput) {
        const guessedAnimal = handlerInput.requestEnvelope.request.intent.slots.animal.value;
        // const guessedAnimal = getSlotValue(handlerInput.requestEnvelope, 'animal');
        
        if (guessedAnimal === PickedAnimal.toLowerCase()) {
            const speakOutput = '<audio src="https://alexa-skills-hackathon-wildlife.s3-ap-southeast-2.amazonaws.com/raw/correctguess.mp3"/>' + switchVoice("Congratulations! You guessed it correctly") + '<audio src="https://alexa-skills-hackathon-wildlife.s3-ap-southeast-2.amazonaws.com/raw/thanks.mp3"/>';
            const repromptOutput = "Do you want next clue?";
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(repromptOutput)
                .withShouldEndSession(true)
                .getResponse();
        } else {
            const speakOutput = '<audio src="https://alexa-skills-hackathon-wildlife.s3-ap-southeast-2.amazonaws.com/raw/wrongguess.mp3"/>' + switchVoice("Sorry, wrong guess. You can ask me the next clue");
            const repromptOutput = "Do you want next clue?";
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(repromptOutput)
                .getResponse();
        }
        
    }
};

const CrapCaptureIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CrapCaptureIntent';
    },
    handle(handlerInput) {
        const speakOutput = "I do not understand that, can you speak something else?";
        const repromptOutput = "sorry i cannot seem to understand what you are saying";
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

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
        const speakOutput = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const Data = [{
        "name": "rabbit",
        "facts": [
            "can be house pet and can be found in the wild",
            "known for fast breeding",
            "Eat their own poop",
            "Known for long ears and jumping",
            "Easter",
            "Hard to catch, fast and zig-zag pattern"
        ]
    },
    {
        "name": "whale",
        "facts": [
            "Can sing",
            "Average weight one hundred and twenty-five  tonnes",
            "Sleep with half brain wake up",
            "Larger than a dinosaur",
            "They give birth to only one baby at a time",
            "Can accelerate up to twenty meter per hour"
        ]
    },
    {
        "name": "elephant",
        "facts": [
            "My brain weighs five kilos",
            "I eat fifty tonnes of food a year",
            "I am a thick-skinned animal, also called pachyderm",
            "It takes twenty-two months from conception to birth",
            "I live in Africa and Asia",
            "I have a long nose"
        ]
    },
    {
        "name": "Mouse",
        "facts": [
            "Scientists use me to save lives",
            "I love cheese",
            "My tail can grow as long as my body",
            "Itchy, Jerry, Micky, Speedy Gonzales, Pinky and the Brain",
            "I have a lot of predators",
            "I’m usually nocturnal"
        ]
    },
    {
        "name": "Hedgehog",
        "facts": [
            "I cannot swim",
            "I have poor eyesight but I have an excellent sense of smell",
            "I eat caterpillars, beetles, earthworms, and slugs",
            "I am well-known in blue color",
            "I gotta go fast",
            "A group of me is called an array"
        ]
    }
];

let PickedAnimalIndex;
let PickedAnimal;

let facts;

function switchVoice(text) {
  if (text){
    return "<voice name='Brian'>" + text + "</voice>"
  }
}

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        ChickenIntentHandler,
        StartGameIntentHandler,
        NextFactIntentHandler,
        GuessCaptureIntentHandler,
        CrapCaptureIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();
