package com.example.feedbackflow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.Map;

public class ResponseRequestDTO {
    @NotNull(message = "Feedback Form ID is required")
    private Long feedbackFormId;

    @NotBlank(message = "Student ID is required")
    private String studentId;

    // questionId -> rating
    @NotNull(message = "Answers are required")
    private Map<Long, Integer> answers;

    public Long getFeedbackFormId() { return feedbackFormId; }
    public void setFeedbackFormId(Long feedbackFormId) { this.feedbackFormId = feedbackFormId; }
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public Map<Long, Integer> getAnswers() { return answers; }
    public void setAnswers(Map<Long, Integer> answers) { this.answers = answers; }
}
