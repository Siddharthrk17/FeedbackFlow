package com.example.feedbackflow.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Response {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "feedback_form_id")
    @JsonIgnoreProperties({"questions", "responses"})
    private FeedbackForm feedbackForm;

    private String studentId;
    private LocalDateTime submittedAt;

    @OneToMany(mappedBy = "response", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"response"})
    private List<Answer> answers = new ArrayList<>();

    public Response() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public FeedbackForm getFeedbackForm() { return feedbackForm; }
    public void setFeedbackForm(FeedbackForm feedbackForm) { this.feedbackForm = feedbackForm; }
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
    public List<Answer> getAnswers() { return answers; }
    public void setAnswers(List<Answer> answers) { this.answers = answers; }
}
