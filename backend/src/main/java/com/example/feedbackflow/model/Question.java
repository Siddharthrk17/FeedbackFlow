package com.example.feedbackflow.model;

import jakarta.persistence.*;

@Entity
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String text;

    @ManyToOne
    @JoinColumn(name = "feedback_form_id")
    private FeedbackForm feedbackForm;

    public Question() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public FeedbackForm getFeedbackForm() { return feedbackForm; }
    public void setFeedbackForm(FeedbackForm feedbackForm) { this.feedbackForm = feedbackForm; }
}
