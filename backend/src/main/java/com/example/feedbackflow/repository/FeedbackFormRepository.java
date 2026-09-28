package com.example.feedbackflow.repository;

import com.example.feedbackflow.model.FeedbackForm;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FeedbackFormRepository extends JpaRepository<FeedbackForm, Long> {
    List<FeedbackForm> findByCourseId(Long courseId);
}
