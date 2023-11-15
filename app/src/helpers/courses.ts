import { Course } from '../interfaces/Course';

// Gets the total number of subscribers from all courses written by the content creator
export function getTotalSubscriberCount(courses: Course[]) {
	let subscribers = 0;
	courses.forEach(course => {
		subscribers += course.numOfSubscriptions ?? 0;
	});
	return subscribers;
}

// Gets the total number of courses written by the content creator
export function getNumberOfCourses(courses: Course[]) {
	return courses.length;
}

// Gets the average rating of all courses written by the content creator
export function getAverageRating(courses: Course[]) {
	let avgRating = 0;
	courses.forEach(course => {
		avgRating += course.rating ?? 0;
	});
	return avgRating / Math.max(courses.length, 1);
}

// Gets the number of courses with a specific status
export function getCourseCountWithStatus(courses: Course[], status: string) {
	let count = 0;
	courses.forEach(course => {
		if (course.status === status) {
			count++;
		}
	});
	return count;
}
