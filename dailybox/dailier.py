#!/usr/bin/env python3

import requests
import pyttsx3

from aiy.board import Board, Led
from aiy.voice import tts

engine = pyttsx3.init()

def onStart(name):
    print ('intro', name)

def onEnd(name, completed):
    print ('finishing', name, completed)
    engine.endLoop()

def talkToBrains(target, payload):
    response = requests.post('https://dailier.herokuapp.com/'+target, json = payload)
    return response.json()

def processAction(action, board):
    if action['type'] == 'SAY':
        board.led.state = Led.ON
        engine.say(action['payload'])
        engine.startLoop()
    elif action['type'] == 'RECORD':
        board.led.state = Led.BLINK

def main():

    engine.connect('started-utterance', onStart)
    engine.connect('finished-utterance', onEnd)

    with Board() as board:
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
