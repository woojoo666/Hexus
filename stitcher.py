# import the necessary packages
import numpy as np
import imutils
import cv2

class Stitcher:
	def __init__(self):
		# determine if we are using OpenCV v3.X
		self.isv3 = imutils.is_cv3()

	def stitch(self, images, ratio=0.75, reprojThresh=4.0,
		showMatches=False):
		# unpack the images, then detect keypoints and extract
		# local invariant descriptors from them
		(imageB, imageA) = images
		(kpsA, featuresA) = self.detectAndDescribe(imageA)
		(kpsB, featuresB) = self.detectAndDescribe(imageB)

		# match features between the two images
		M = self.matchKeypoints(kpsA, kpsB,
			featuresA, featuresB, ratio, reprojThresh)

		# if the match is None, then there aren't enough matched
		# keypoints to create a panorama
		if M is None:
			print("i sucj")
			return None


		# otherwise, apply a perspective warp to stitch the images
		# together
		(matches, H, status) = M
		result = cv2.warpPerspective(imageA, H,
			(imageA.shape[1] + imageB.shape[1], imageA.shape[0]))
		# print (imageB.shape)
		# print (type(result))

		##########
		##########

		# 1. get inverse mask of parent image
		# 2. combine mask with new image
		# 3. add new image to parent image

		# img2gray = cv2.cvtColor(imageB,cv2.COLOR_BGR2GRAY)
		# ret, mask = cv2.threshold(img2gray, 10, 255, cv2.THRESH_BINARY)
		# mask_inv = cv2.bitwise_not(mask)

		# # Now black-out the area of logo in ROI
		# # img1_bg = cv2.bitwise_and(roi,roi,mask = mask_inv)
		# img1_bg = cv2.bitwise_and(imageA,imageA,mask = mask_inv)

		# Take only region of logo from logo image.
		# img2_fg = cv2.bitwise_and(imgageB,img2,mask = mask)

		# # Put logo in ROI and modify the main image
		# dst = cv2.add(img1_bg,img2_fg)
		# img1[0:rows, 0:cols ] = dst

		############
		############


		result[0:imageB.shape[0], 0:imageB.shape[1]] = imageB
		# result = cv2.add(result, imageB)
		# check to see if the keypoint matches should be visualized
		if showMatches:
			vis = self.drawMatches(imageA, imageB, kpsA, kpsB, matches,
				status)

			# return a tuple of the stitched image and the
			# visualization
			return (result, vis)

		# return the stitched image
		return result

	def detectAndDescribe(self, image):
		# convert the image to grayscale
		gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

		# check to see if we are using OpenCV 3.X
		if self.isv3:
			# detect and extract features from the image
			descriptor = cv2.xfeatures2d.SIFT_create()
			(kps, features) = descriptor.detectAndCompute(image, None)
			# print (kps)
			# print (features)

		# otherwise, we are using OpenCV 2.4.X
		else:
			# detect keypoints in the image
			detector = cv2.FeatureDetector_create("SIFT")
			kps = detector.detect(gray)

			# extract features from the image
			extractor = cv2.DescriptorExtractor_create("SIFT")
			(kps, features) = extractor.compute(gray, kps)

		# convert the keypoints from KeyPoint objects to NumPy
		# arrays
		kps = np.float32([kp.pt for kp in kps])

		# return a tuple of keypoints and features
		return (kps, features)

	def matchKeypoints(self, kpsA, kpsB, featuresA, featuresB,
		ratio, reprojThresh):
		# compute the raw matches and initialize the list of actual
		# matches
		matcher = cv2.DescriptorMatcher_create("BruteForce")
		rawMatches = matcher.knnMatch(featuresA, featuresB, 2)
		matches = []

		# loop over the raw matches
		for m in rawMatches:
			# ensure the distance is within a certain ratio of each
			# other (i.e. Lowe's ratio test)
			if len(m) == 2 and m[0].distance < m[1].distance * ratio:
				matches.append((m[0].trainIdx, m[0].queryIdx))

		# computing a homography requires at least 4 matches
		if len(matches) > 4:
			# construct the two sets of points
			ptsA = np.float32([kpsA[i] for (_, i) in matches])
			ptsB = np.float32([kpsB[i] for (i, _) in matches])

			# compute the homography between the two sets of points
			(H, status) = cv2.findHomography(ptsA, ptsB, cv2.RANSAC,
				reprojThresh)

			# return the matches along with the homograpy matrix
			# and status of each matched point
			return (matches, H, status)

		# otherwise, no homograpy could be computed
		return None

	def drawMatches(self, imageA, imageB, kpsA, kpsB, matches, status):
		# initialize the output visualization image
		(hA, wA) = imageA.shape[:2]
		(hB, wB) = imageB.shape[:2]
		vis = np.zeros((max(hA, hB), wA + wB, 3), dtype="uint8")
		vis[0:hA, 0:wA] = imageA
		vis[0:hB, wA:] = imageB

		# loop over the matches
		for ((trainIdx, queryIdx), s) in zip(matches, status):
			# only process the match if the keypoint was successfully
			# matched
			if s == 1:
				# draw the match
				ptA = (int(kpsA[queryIdx][0]), int(kpsA[queryIdx][1]))
				ptB = (int(kpsB[trainIdx][0]) + wA, int(kpsB[trainIdx][1]))
				cv2.line(vis, ptA, ptB, (0, 255, 0), 1)

		# return the visualization
		return vis






if __name__ == '__main__':

	# stitch the images together to create a panorama
	stitcher = Stitcher()


	name = "power"
	# so, the list of images should be labelled <name>_1.jpg, <name>_2.jpg... and they 
	# should be ordered from left to right


	result = imutils.resize(cv2.imread("{}_{}.jpg".format(name, 1)), width = 400)
	result_width = 400

	for num in range(2,7):
		image = "{}_{}.jpg".format(name, num)
		print(image)
		resized_image = imutils.resize(cv2.imread(image), width=400)
		(result, vis) = stitcher.stitch((result[:,0:result_width], resized_image), showMatches=True)
		# cv2.imshow("Keypoint Match", vis)
		# cv2.imshow("Intermediate Result", result)
		# cv2.waitKey(0)
		result_width += 80
		result = result[:, 0:result_width]


	cv2.imshow("Final Result", result)
	cv2.waitKey(0)
	cv2.imwrite("{}_success.jpg".format(name), result)