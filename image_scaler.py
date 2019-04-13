from os import listdir
from os.path import realpath, isfile,join
import re

from PIL import Image

from resizeimage import resizeimage

instagram_format = [864,1080]
facebook_format = [1920,1080]

def scale_images(path_to_folder):
    image_regex = r'\.jpeg|'
    """ 
        scale image for instagram and facebook
        instagram format => 864(width) : 1080(height) (4:5)
        facebook format => 1920 x 1080 ( 16 : 9 )

        generate images with prefix instagram_/facebook_
    """

    folder = realpath(path_to_folder)

    onlyfiles = [f for f in listdir(folder) if isfile(join(folder, f))]
    
    folder += "/"
    ok_files = 0

    for filename in onlyfiles:
        if re.match(r'facebook_|instagram_', filename):
            continue
        with open(folder + filename, "r+b") as f:
            try:
                with Image.open(f) as image:

                    if ( check_size_facebook(image) ):
                        ok_files += 1
                        try:
                            facebook_cover = resizeimage.resize_cover(image, facebook_format)
                            facebook_cover.save(folder + "facebook_" + filename, image.format)
                        except resizeimage.ImageSizeError:
                            image.save(folder + "facebook_" + filename, image.format)

                    if ( check_size_instagram(image) ):
                        ok_files += 1
                        try:
                            instagram_cover = resizeimage.resize_cover(image, instagram_format)
                            instagram_cover.save(folder + "instagram_" + filename, image.format)
                        except resizeimage.ImageSizeError:
                            image.save(folder + "instagram_" + filename, image.format)
            except OSError:
                pass

    return ok_files

def check_size_instagram(img):
    size = img.size
    if ( size[1] > size[0] ):
        return True

    return False

def check_size_facebook(img):
    size = img.size
    if ( size[0] > size[1] ):
        return True

    return False

