#!/usr/bin/env python3

import requests
import pyttsx3
import argparse
import locale

from aiy.board import Board, Led
from aiy.cloudspeech import CloudSpeechClient

engine = pyttsx3.init()
client = CloudSpeechClient()
parser = argparse.ArgumentParser(description='Assistant service example.')
parser.add_argument('--language', default=locale_language())
args = parser.parse_args()

def locale_language():
    language, _ = locale.getdefaultlocale()
    return language

def onBoxTalkStart(name):
    print ('intro', name)

def onBoxTalkEnd(name, completed):
    print ('finishing', name, completed)
    engine.endLoop()

def talkToBrains(target, payload):
    response = requests.post('https://dailier.herokuapp.com/'+target, json = payload)
    return response.json()

def processAction(action, board):
    if action['type'] == 'SAY':
        board.led.state = Led.ON
        engine.say(action['payload'], action['type'])
        engine.startLoop()
    elif action['type'] == 'RECORD':
        board.led.state = Led.BLINK
        text = client.recognize(language_code=args.language)

        if text is None:
            print('You said nothing.')
        else:
            print(text.lower())
            talkToBrains(action['payload'], { 'payload': text })

def main():

    engine.connect('started-utterance', onBoxTalkStart)
    engine.connect('finished-utterance', onBoxTalkEnd)

    with Board() as board:
        print('PRESS BUTTON TO START APP')
        board.button.wait_for_press()
        print('START THE APP')
        content = talkToBrains('actions', { "action": "start" })
        for action in content['actions']:
            processAction(action, board)

        board.button.wait_for_release()
        print('OFF')
        board.led.state = Led.OFF

if __name__ == '__main__':
    main()
