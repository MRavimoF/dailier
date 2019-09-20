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
parser = argparse.ArgumentParser(description='Assistant service example.')
parser.add_argument('--language', default=locale_language())
args = parser.parse_args()

client = CloudSpeechClient()

def onBoxTalkStart(name):
    print ('intro', name)

def onBoxTalkEnd(name, completed):
    print ('finishing', name, completed)
    engine.endLoop()

def record(board):
    board.led.state = Led.BLINK
    text = client.recognize(language_code=args.language)

    if text is None:
        print('You said nothing.')
    else:
        print(text.lower())

def main():


    engine.connect('started-utterance', onBoxTalkStart)
    engine.connect('finished-utterance', onBoxTalkEnd)

    with Board() as board:
        print('PRESS BUTTON TO START APP')
        board.button.wait_for_press()
        print('RUNNING')
        record(board)

        board.button.wait_for_release()
        print('OFF')
        board.led.state = Led.OFF

if __name__ == '__main__':
    main()
