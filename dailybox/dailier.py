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


def main():

    client = CloudSpeechClient()
    parser = argparse.ArgumentParser(description='Assistant service example.')
    parser.add_argument('--language', default=locale_language())
    args = parser.parse_args()

    engine = pyttsx3.init()

    def onStart(name):
        print ('intro', name)

    def onEnd(name, completed):
        print ('finishing', name, completed)
        if name == 'intro':
            engine.endLoop()
        elif name == 'end':
            engine.endLoop()

    engine = pyttsx3.init()
    engine.connect('started-utterance', onStart)
    engine.connect('finished-utterance', onEnd)

    with Board() as board:
        print('PRESS BUTTON TO START APP')
        board.button.wait_for_press()
        print('START THE APP')
        response = requests.post('https://dailier.herokuapp.com/actions', json = { "action": "start" })
        content = response.json()
        print(response.content)
        board.led.state = Led.BLINK
        engine.say(content['actions'][0]['payload'],'intro')
        board.led.state = Led.ON
        engine.startLoop()
        
        # RECORD
        board.led.state = Led.BLINK

        text = client.recognize(language_code=args.language)

        if text is None:
            logging.info('You said nothing.')
        else:
            print(text.lower())

        board.button.wait_for_release()
        print('OFF')
        board.led.state = Led.OFF

if __name__ == '__main__':
    main()
