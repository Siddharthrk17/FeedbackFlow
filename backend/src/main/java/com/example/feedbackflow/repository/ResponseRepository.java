package com.example.feedbackflow.repository;

import com.example.feedbackflow.model.Response;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResponseRepository extends JpaRepository<Response, Long> {
    boolean existsByStudentIdAndFeedbackFormId(String studentId, Long feedbackFormId);
}
