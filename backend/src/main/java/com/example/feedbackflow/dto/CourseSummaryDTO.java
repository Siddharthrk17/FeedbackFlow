package com.example.feedbackflow.dto;

import java.util.List;

public class CourseSummaryDTO {
    private Long courseId;
    private String courseCode;
    private String title;
    private String semester;
    private double overallAverage;
    private List<QuestionSummaryDTO> questionSummaries;
    private long totalResponses;

    public CourseSummaryDTO(Long courseId, String courseCode, String title, String semester, double overallAverage, List<QuestionSummaryDTO> questionSummaries, long totalResponses) {
        this.courseId = courseId;
        this.courseCode = courseCode;
        this.title = title;
        this.semester = semester;
        this.overallAverage = overallAverage;
        this.questionSummaries = questionSummaries;
        this.totalResponses = totalResponses;
    }

    public Long getCourseId() { return courseId; }
    public String getCourseCode() { return courseCode; }
    public String getTitle() { return title; }
    public String getSemester() { return semester; }
    public double getOverallAverage() { return overallAverage; }
    public List<QuestionSummaryDTO> getQuestionSummaries() { return questionSummaries; }
    public long getTotalResponses() { return totalResponses; }
}
