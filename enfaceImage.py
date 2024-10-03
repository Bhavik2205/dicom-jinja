import numpy as np
import os
import time
import cv2

def increase_brightness(img, value=40):
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    h, s, v = cv2.split(hsv)
    lim = 255 - value
    v[v > lim] = 255
    v[v <= lim] += value
    final_hsv = cv2.merge((h, s, v))
    img = cv2.cvtColor(final_hsv, cv2.COLOR_HSV2BGR)
    return img

def readImages(pathname):
    images=[]
    for i in range(1,513):
        if(i%10==i):
            partName="00"+str(i)
        elif(i%100==i):
            partName="0"+str(i)
        else:
            partName=str(i)
    
        filename=pathname+partName+".tif"
        images.append(cv2.imread(filename))
     
    return images

if __name__ == "__main__":
    start_time = time.time()
    height=width=512
    enface_image = np.zeros((height,width,3), float)
    pathname=r"C:\Users\BAPS\Downloads\onh_os_BScan_2023-11-11,18.05\onh_os_BScan_2023-11-11,18.05\onh_os-"
    images=readImages(pathname)
    for i in range(len(images)):
        # enface_image[i,0:512]=np.sum(images[i], axis=0)/512
        if images[i] is not None:
            enface_image[i, 0:512] = np.sum(images[i], axis=0) / 512
    # else:
    #     print(f"Image at index {i} could not be loaded.")
        
    enface_image = cv2.normalize(enface_image, None, 0, 255, cv2.NORM_MINMAX, cv2.CV_8U)
    enface_img_contrast = increase_brightness(enface_image)
    cv2.imwrite("EnfaceImageOutput.jpg",enface_image)
    cv2.imwrite("EnfaceImageOutputContrast.jpg",enface_img_contrast)
    print("--- Total time taken %s seconds ---" % (time.time() - start_time))
    
