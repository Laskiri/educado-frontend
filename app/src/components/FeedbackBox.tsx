import React, { useState, useEffect } from 'react';
import { BACKEND_URL } from '../helpers/environment';
import CourseServices from '../services/course.services';
import Loading from './general/Loading';

interface Feedback {
    _id: string;
    rating: number;
    feedbackText: string;
    dateCreated: string;
}

interface FeedbackBoxProps {
    id: string;
    token: string;
}

const FeedbackBox: React.FC<FeedbackBoxProps> = ({ id, token }) => {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            if (id !== '' && token !== '') {
                try {
                    const response = await CourseServices.getCourseFeedback(`${BACKEND_URL}/api/feedback/${id}`, token);
                    setFeedbacks(response.data);
                } catch (error) {
                    console.error('Error fetching feedbacks:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchFeedbacks();
    }, [id, token]);

    if (loading) return <Loading />;

    return (
        <div className="feedback-box bg-white p-4 rounded shadow-md overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Course Feedback</h2>
            {feedbacks.length > 0 ? (
                feedbacks.map(feedback => (
                    <div key={feedback._id} className="feedback-item mb-2">
                        <p className="text-sm">Rating: {feedback.rating}</p>
                        <p className="text-sm">{feedback.feedbackText}</p>
                        <small className="text-gray-500">On {new Date(feedback.dateCreated).toLocaleDateString()}</small>
                    </div>
                ))
            ) : (
                <p>No feedback available for this course.</p>
            )}
        </div>
    );
};

export default FeedbackBox;