import numpy

def find_target(source_point, source_orientation, points):
	""" Returns the point in points which the source points closest to """
	minimum = None
	distance = 181

	for point in points:
		ret = distance_function(source_point, source_orientation, point)
		print("point: {} angle: {}".format(point, ret))
		if ret < distance:
			distance = ret
			minimum = point
	return minimum

def distance_function(source_point, source_orientation, point):
	""" Returns some floating point metric which states how close an
	 object is to being pointed at by the source. A lower score indicates
	 the object is pointing more directly at the source"""
	magnitude = numpy.linalg.norm(source_point - point)
	angle = angle_between(source_orientation, point - source_point)
	return angle

def unit_vector(vector):
    """ Returns the unit vector of the vector.  """
    return vector / numpy.linalg.norm(vector)

def angle_between(v1, v2):
    """ Returns the angle in radians between vectors 'v1' and 'v2' """
    v1_u = unit_vector(v1)
    v2_u = unit_vector(v2)
    if not numpy.any(v1_u) or not numpy.any(v2_u):
    	return 0
    return numpy.rad2deg(numpy.arccos(numpy.clip(numpy.dot(v1_u, v2_u), -1.0, 1.0)))



if __name__ == '__main__':
	b = numpy.array((1,1,0))
	a = numpy.array((0.1,0,0))

	src_point = numpy.array([1,1,0])
	src_orientation = numpy.array([-1,1,0])
	points = numpy.array([[0,2,0], [1,2,0]])
	print(find_target(src_point, src_orientation, points))

	src_point = numpy.array([1,1,0])
	src_orientation = numpy.array([0,1,0])
	points = numpy.array([[0,2,0], [1,2,0]])
	print(find_target(src_point, src_orientation, points))