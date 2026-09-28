package com.example.feedbackflow.repository;

import com.example.feedbackflow.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByFacultyName(String facultyName);
}
