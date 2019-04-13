import moviepy.editor as mpe


def image_to_rotate_clip(image_path):
    clip = mpe.ImageClip(image_path)
    rotated_clip = (clip.add_mask()
                    .fx(mpe.vfx.rotate, lambda t: 4 * t, expand=False)
                    .set_duration(4)).resize(lambda t: 1 + 0.115*t)
    final_clip = mpe.CompositeVideoClip([rotated_clip.set_pos("center")])
    reverse_clip = final_clip.fx(mpe.vfx.time_mirror)
    final_clip = final_clip.subclip(0.5, -0.5)
    reverse_clip = reverse_clip.subclip(0.5, -0.5)
    to_write = mpe.concatenate_videoclips([final_clip, reverse_clip])
    return to_write
    # to_write.write_videofile("final2.mp4", fps=25)
