from moviepy.editor import *
from slice import long_slice, width_slice

def four_in_row(image):
    long_slice(image)
    imclip1 = ImageClip("/tmp/slice_1.png").set_duration(0.7)
    imclip2 = ImageClip("/tmp/slice_2.png").set_duration(0.7)
    imclip3 = ImageClip("/tmp/slice_3.png").set_duration(0.7)
    imclip4 = ImageClip("/tmp/slice_4.png").set_duration(0.7)
    imclip5 = ImageClip(image).set_duration(3)

    clip1 = [imclip1.set_start(1)], [imclip2.set_start(2)], [imclip3.set_start(3)], [imclip4.set_start(4)]
    moving_clip = clips_array(clip1)
    moving_clip.set_duration(8)
    final_clip = concatenate_videoclips([moving_clip, imclip5])
    return final_clip
    # final_clip.write_videofile("test2.mp4", fps=25)

def four_in_width(image):
    width_slice(image)
    imclip1 = ImageClip("/tmp/slice_1.png").set_duration(2.1)
    imclip2 = ImageClip("/tmp/slice_2.png").set_duration(1.4)
    imclip3 = ImageClip("/tmp/slice_3.png").set_duration(2.8)
    imclip4 = ImageClip("/tmp/slice_4.png").set_duration(0.7)
    imclip5 = ImageClip(image).set_duration(2)

    clip1 = [imclip1.set_start(1.4), imclip2.set_start(2.1), imclip3.set_start(0.7), imclip4.set_start(2.8)]
    moving_clip = clips_array([clip1])
    moving_clip.set_duration(5)
    final_clip = concatenate_videoclips([moving_clip, imclip5])
    return final_clip
    # final_clip.write_videofile("test1.mp4", fps=25)
