package com.example.feedbackflow.dto;

public class QuestionSummaryDTO {
    private String text;
    private double averageRating;

    public QuestionSummaryDTO(String text, double averageRating) {
        this.text = text;
        this.averageRating = averageRating;
    }

    public String getText() { return text; }
    public double getAverageRating() { return averageRating; }
}
