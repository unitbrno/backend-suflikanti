import eyed3
from os import listdir
from os.path import isfile, join, realpath

## Getting all files from folder
def create_album_record(path_to_mp3):
    """ Returns list of dictionaries with keys, values
     song_name - name of song
     duration - duration of song in seconds
     path - path to song 
    """
    album_music = list()

    final_output = list()
    mypath = path_to_mp3

    onlyfiles = [f for f in listdir(mypath) if isfile(join(mypath, f))]

    for filename in onlyfiles:
        album_music.append(filename)

    for mp3_file in album_music:
        mp3 = eyed3.load(mypath + mp3_file)
        duration = mp3.info.time_secs
        song_path = realpath(mypath + mp3_file)

        final_output.append({"song_name" : mp3_file, "duration" : duration, "path" : song_path})

    return final_output


def create_image_record(path_to_img):
    """ Returns list of dictionaries with keys, values
     image_name - name of image with extension
     path - path to image
    """
    image_names = list()
    final_output = list()


    mypath = path_to_img

    onlyfiles = [f for f in listdir(mypath) if isfile(join(mypath, f))]
    
    for filename in onlyfiles:
        image_names.append(filename)
        
        image_path = realpath(mypath + filename)

        final_output.append({"image_name" : filename, "image_path" : image_path})
    
    return final_output

