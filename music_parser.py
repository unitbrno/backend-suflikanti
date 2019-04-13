from os.path import realpath
import aubio
import numpy as np
from file_parser import create_album_record
import sys
import time
import os

from os import listdir
from os.path import isfile, join

def avg_frequence(path_to_music):
    downsample = 1
    samplerate = 44100 // downsample

    win_s = 4096 // downsample
    hop_s = 512 // downsample

    src = aubio.source(path_to_music, samplerate, hop_s)
    samplerate = src.samplerate

    pitch_o = aubio.pitch("yinfft", win_s, hop_s, samplerate)
    
    total_frames = 0
    counter = 0
    total_pitch = 0

    while True:
        counter += 1
        samples, read = src()

        pitch = pitch_o(samples)[0]

        total_frames += read
        total_pitch += pitch

        if ((total_frames / float(samplerate)) > 5.1):
            break

    return (total_pitch/counter)



def set_intro_song(music_folder, quick=False):
    music_folder = realpath(music_folder)
    music_folder += "/"

    songs = create_album_record(music_folder)

    if ( quick ):
            min_density = 0
    else:
        min_density = sys.maxsize

    for i in songs:
        density = avg_frequence(i["path"])
        if ( quick ):
                if density > min_density:
                        min_density = density
                        min_song = i
        else:
                if density < min_density:
                        min_density = density
                        min_song = i

    return min_song

