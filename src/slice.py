from __future__ import division
import math
import os
from PIL import Image

def long_slice(image_path):
    outdir = "/tmp/"
    """slice an image into parts slice_size tall"""
    img = Image.open(image_path)
    width, height = img.size
    upper = 0
    left = 0
    slices = 4
    slice_size = height // 4

    count = 1
    for slice in range(slices):
        #if we are at the end, set the lower bound to be the bottom of the image
        if count == slices:
            lower = height
        else:
            lower = int(count * slice_size)

        bbox = (left, upper, width, lower)
        working_slice = img.crop(bbox)
        upper += slice_size
        working_slice.save(os.path.join(outdir, "slice_" + str(count)+".png"))
        count +=1

def width_slice(image_path):
    outdir = "/tmp/"
    img = Image.open(image_path)
    width, height = img.size
    upper = 0
    left = 0
    right = 0
    slices = 4
    slice_size = width // 4

    count = 1
    for slice in range(slices):
        # if we are at the end, set the lower bound to be the bottom of the image
        if count == slices:
             right = width
        else:
            right = int(count * slice_size)

        bbox = (left, upper, right, height)
        working_slice = img.crop(bbox)
        left += slice_size
        working_slice.save(os.path.join(outdir, "slice_" + str(count) + ".png"))
        count += 1

if __name__ == '__main__':
    width_slice("tomorrow-land-990470_1920.jpg")