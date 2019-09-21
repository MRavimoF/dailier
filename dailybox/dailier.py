#!/usr/bin/env python3

import requests
import pyttsx3
import argparse
import locale

from aiy.board import Board, Led
from aiy.cloudspeech import CloudSpeechClient

def locale_language():
    language, _ = locale.getdefaultlocale()
    return language

engine = pyttsx3.init()
client = CloudSpeechClient()
parser = argparse.ArgumentParser(description='Assistant service example.')
parser.add_argument('--language', default=locale_language())
args = parser.parse_args()
loop = True

def onBoxTalkStart(name):
    print ('intro', name)

def onBoxTalkEnd(name, completed):
    print ('finishing', name, completed)
    #if(name == "SAY"):
    #    engine.endLoop()

def talkToBrains(target, payload):
    url = 'https://dailier.herokuapp.com'+target
    print('POST ' + url)
    response = requests.post(url, json = payload)
    print('Received response: ' + response.text)
    return response.json()['actions']

def recordUntilKeyword(board):
    global loop
    print("START RECORDING")
    board.led.state = Led.BLINK
    board.button.when_pressed = quitRecording
    collected = []
    loop = True
    while loop:
        print("START calling client.recoqnize")
        text = client.recognize(language_code=args.language)
        print("END calling client.recoqnize")
        if text is None:
            print('You said nothing.')
        else:
            print("You said: " + text)
            sanitized = text.lower()
            if loop:
                loop = sanitized.find('peacock') == -1
            collected.append(sanitized.replace('peacock',''))
    board.led.state = Led.OFF
    board.button.when_pressed = None
    print("STOP RECORDING")
    return ' '.join(collected)

def quitRecording():
    global loop
    print('quit recording loop')
    client.stop_listening()
    loop = False

def processActions(actions, board):
    for action in actions:
        processAction(action, board)

def processAction(action, board):
    if action['type'] == 'SAY':
        board.led.state = Led.ON
        engine.say(action['data'], action['type'])
        engine.runAndWait()
        while engine.isBusy():
            print("talking too long")
    elif action['type'] == 'RECORD':
        text = recordUntilKeyword(board)
        newActions = talkToBrains(action['callback'], { 'data': text })
        processActions(newActions, board)

def main():

    engine.connect('started-utterance', onBoxTalkStart)
    engine.connect('finished-utterance', onBoxTalkEnd)

    with Board() as board:
        print('PRESS BUTTON TO START APP')
        board.button.wait_for_press()
        print('START THE APP')
        actions = talkToBrains('/actions', { "action": "start" })
        processActions(actions, board)

        board.button.wait_for_release()
        print('OFF')
        board.led.state = Led.OFF

if __name__ == '__main__':
    main()
