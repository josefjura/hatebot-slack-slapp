'use strict'

const express = require('express')
const Slapp = require('slapp')
const ConvoStore = require('slapp-convo-beepboop')
const Context = require('slapp-context-beepboop')

// use `PORT` env var on Beep Boop - default to 3000 locally
var port = process.env.PORT || 3000

var slapp = Slapp({
  // Beep Boop sets the SLACK_VERIFY_TOKEN env var
  verify_token: process.env.SLACK_VERIFY_TOKEN,
  convo_store: ConvoStore(),
  context: Context()
})


var HELP_TEXT = `
I will respond to the following messages:
\`help\` - to see this message.
\`brutal\` - to find out if we are human and the purpose of life.
\`obscene\` - to find out if we are human and the purpose of life.
`

//*********************************************
// Setup different handlers for messages
//*********************************************

// response to the user typing "help"
slapp.message('help', ['mention', 'direct_message'], (msg) => {
  msg.say(HELP_TEXT)
})

// "Conversation" flow that tracks state - kicks off when user says hi, hello or hey
slapp.message('^(.*?)(dlouho|kdy|datum).*?([Bb]rutal(u)?).*?\\?.*?$', ['mention', 'direct_message'], (msg, text, greeting) => {
  msg.say("Zatim nevime, datum Brutalu jeste neni oficialni");
});

slapp.message('^(.*?)(dlouho|kdy|datum).*?([Oo]bscen[eu]).*?\\?.*?$', ['mention', 'direct_message'], (msg, text, greeting) => {
  msg.say(timespanReply("Obscene Extreme", new Date(2018, 6, 18)));
});

slapp.message('.*', ['direct_mention', 'direct_message'], (msg) => {
  // respond only 40% of the time
    msg.say('Co to meles hovadko?')
})

// attach Slapp to express server
var server = slapp.attachToExpress(express())

// start http server
server.listen(port, (err) => {
  if (err) {
    return console.error(err)
  }

  console.log(`Listening on port ${port}`)
})


function timespanReply(eventName, date){
  return eventName + " zacina za " + dateDiff(date) + " dni";
}

function dateDiff(date) {
  var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  return Math.round(Math.abs((date.getTime() - Date.now()) / (oneDay)));
}