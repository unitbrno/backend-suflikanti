import os, shutil
from os.path import join, realpath, dirname
from flask import Flask, flash, request, redirect, url_for, send_from_directory, render_template, send_file
from werkzeug.utils import secure_filename
from image_scaler import *
from random import choice
from transition import *
from music_parser import set_intro_song
import random


DIR_PATH = dirname(realpath(__file__))
DOCUMENTS = join(DIR_PATH, 'documents')
STATIC_FOLDER = join(DIR_PATH, 'static')
TEMPLATES_FOLDER = join(DIR_PATH, 'templates')
BACKGROUND_FOLDER = join(DOCUMENTS, 'backgrounds')
LOGOS_FOLDER = join(DOCUMENTS, 'logos')
VIDEOS_FOLDER = join(DOCUMENTS, 'videos')
SONGS_FOLDER = join(DOCUMENTS, 'songs')
ALLOWED_EXTENSIONS = ('txt', "mp3", 'png', 'jpg', 'jpeg', 'gif', 'mp4')

app = Flask(__name__, static_url_path=STATIC_FOLDER)
app.config['STATIC_FOLDER'] = STATIC_FOLDER
app.config['BACKGROUNDS'] = BACKGROUND_FOLDER
app.config['LOGOS'] = LOGOS_FOLDER
app.config['VIDEOS'] = VIDEOS_FOLDER
app.config['SONGS'] = SONGS_FOLDER


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        if not request.files:
            flash('No file part')
            return redirect(request.url)

        for check_name in ("backgrounds", "logos", "songs", "videos"):
            file_list = request.files.getlist(check_name)
            if file_list:
                for file in file_list:
                    if file.filename == '':
                        # flash('No selected file')
                        # return redirect(request.url)
                        continue
                    if file and allowed_file(file.filename):
                        filename = secure_filename(file.filename)
                        file.save(os.path.join(app.config[check_name.upper()], filename))
            else:
                continue

        return "File uploaded"
    elif request.method == 'GET':
        return render_template('index.html')


@app.route('/produce_video', methods=['GET', 'POST'])
def test_movie():
    scale_images(app.config['BACKGROUNDS'])
    if request.method == 'POST':
        options = request.form.to_dict(flat=False)
        options = {key: options[key][0] for key in options.keys()}
        clip_path = movie_creation(**options)
        if not clip_path:
            return "No good images"
        return send_file(join(dirname(realpath(__file__)), clip_path), as_attachment=True)


def movie_creation(duration=3, fast=False, intro=False, outro=False, platform="IG", font=1):
    format_for_out_input = 0 if platform == "IG" else 1
    font = int(font)

    count_of_pic = int(duration)
    intro = False if intro == 'False' or not intro else True
    outro = False if outro == 'False' or not outro else True

    music_song = set_intro_song(SONGS_FOLDER, quick=fast).get('path')


    fast_multi_trans = multifast
    slow_multi_trans = multislow

    fast_one_trans = onefast
    slow_one_trans = oneslow

    platform_to_choose = "instagram_" if platform == "IG" else "facebook_"
    scale_images(BACKGROUND_FOLDER)

    all_files = os.listdir(BACKGROUND_FOLDER)
    chosen_pics = validate_pics_and_choose_subset(all_files, platform_to_choose, count_of_pic)

    if not chosen_pics:
        return ''

    intro_clip = None
    if intro:
        all_logos = os.listdir(LOGOS_FOLDER)
        chosen_logo = validate_pics_and_choose_subset(all_logos, "", 1)

        all_videos = os.listdir(VIDEOS_FOLDER)
        chosen_background = validate_pics_and_choose_subset(all_videos, "", 1)

        intro_clip = intro_logo_with_background(
            join(VIDEOS_FOLDER, chosen_background[0]), join(LOGOS_FOLDER, chosen_logo[0]), format_plat=format_for_out_input
        )

    count_of_pic = int(count_of_pic)
    if count_of_pic > 2:
        if fast:
            chosen_trans = choice(fast_multi_trans)
        else:
            chosen_trans = choice(slow_multi_trans)
    else:
        if fast:
            chosen_trans = choice(fast_one_trans)
        else:
            chosen_trans = choice(slow_one_trans)

    pics_with_path = [join(BACKGROUND_FOLDER, pic) for pic in chosen_pics]
    clip = chosen_trans(pics_with_path[0] if count_of_pic == 1 else pics_with_path)

    if intro:
        clip = concatenate_videoclips([intro_clip, clip.set_position("center", "center").resize(intro_clip.size)])

    if outro:
        outro = last_clip(text='This is not bug', release_date='This is feature',teaser='ON SALE',format=format_for_out_input, font=font)
        clip = concatenate_videoclips([clip, outro.resize(clip.size)])
        #add outro

    if music_song:
        clip = audio_to_clip(music_song, clip)
    path = "final.mp4"
    clip.write_videofile(path, fps=25)

    delete_old_files()

    return path


def delete_old_files():
    folder_list = ["./documents/backgrounds/","./documents/logos/","./documents/songs/","./documents/videos/"]

    for folder in folder_list:
        folder = realpath(folder)
        for the_file in os.listdir(folder):
            file_path = os.path.join(folder, the_file)
            try:
                if os.path.isfile(file_path):
                    os.unlink(file_path)
                #elif os.path.isdir(file_path): shutil.rmtree(file_path)
            except Exception as e:
                print(e)


def validate_pics_and_choose_subset(files, platform, count_of_pics):
    valid_pics = []
    chosen_pics = []
    for pic in files:
        if platform in pic and pic[0] != ".":
            valid_pics.append(pic)

    if not valid_pics:
        return None

    for i in range(count_of_pics):
        chosen_pic = (choice(valid_pics))
        chosen_pics.append(chosen_pic)
        valid_pics.pop(valid_pics.index(chosen_pic))
        if not valid_pics:
            return chosen_pics

    return chosen_pics


if __name__ == '__main__':
    app.run()
