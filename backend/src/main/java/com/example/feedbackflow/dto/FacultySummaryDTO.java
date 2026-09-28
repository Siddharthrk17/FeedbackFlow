package com.example.feedbackflow.dto;

import java.util.List;

public class FacultySummaryDTO {
    private String facultyName;
    private List<CourseSummaryDTO> courses;

    public FacultySummaryDTO(String facultyName, List<CourseSummaryDTO> courses) {
        this.facultyName = facultyName;
        this.courses = courses;
    }

    public String getFacultyName() { return facultyName; }
    public List<CourseSummaryDTO> getCourses() { return courses; }
}
