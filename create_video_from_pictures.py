import os
import glob

from moviepy.video.VideoClip import ImageClip
from moviepy.video.compositing.concatenate import *

from natsort import natsorted

base_dir = os.path.realpath("pictures/")
print(base_dir)

gif_name = 'pic'
fps = 24

file_list = glob.glob('pictures/*.jpg')  # Get all the pngs in the current directory
print(len(file_list))
file_list_sorted = natsorted(file_list, reverse=False)  # Sort the images

clips = [ImageClip(m).set_duration(2)
         for m in file_list_sorted]


concat_clip = concatenate_videoclips(clips, method="compose")

concat_clip.write_videofile("test.mp4", fps=fps)
