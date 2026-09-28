package com.example.feedbackflow.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public class FeedbackFormRequestDTO {
    @NotNull(message = "Course ID is required")
    private Long courseId;

    @NotBlank(message = "Semester is required")
    private String semester;

    @NotNull(message = "Closing date is required")
    @Future(message = "Closing date must be in the future")
    private LocalDate closingDate;

    @NotNull(message = "Questions are required")
    private List<String> questions;

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }
    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }
    public LocalDate getClosingDate() { return closingDate; }
    public void setClosingDate(LocalDate closingDate) { this.closingDate = closingDate; }
    public List<String> getQuestions() { return questions; }
    public void setQuestions(List<String> questions) { this.questions = questions; }
}
