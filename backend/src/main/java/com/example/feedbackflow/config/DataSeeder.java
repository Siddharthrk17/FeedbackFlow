package com.example.feedbackflow.config;

import com.example.feedbackflow.model.Course;
import com.example.feedbackflow.repository.CourseRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final CourseRepository courseRepository;

    public DataSeeder(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (courseRepository.count() == 0) {
            courseRepository.save(new Course("CS101", "Introduction to Programming", "Dr. Alan Turing"));
            courseRepository.save(new Course("CS102", "Data Structures", "Dr. Grace Hopper"));
            courseRepository.save(new Course("CS201", "Algorithms", "Dr. Alan Turing"));
            courseRepository.save(new Course("MTH101", "Calculus I", "Dr. John von Neumann"));
        }
    }
}
