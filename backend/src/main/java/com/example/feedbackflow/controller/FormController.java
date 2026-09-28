package com.example.feedbackflow.controller;

import com.example.feedbackflow.model.FeedbackForm;
import com.example.feedbackflow.repository.FeedbackFormRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/forms")
@CrossOrigin(origins = "*")
public class FormController {

    private final FeedbackFormRepository feedbackFormRepository;

    public FormController(FeedbackFormRepository feedbackFormRepository) {
        this.feedbackFormRepository = feedbackFormRepository;
    }

    @GetMapping
    public List<FeedbackForm> getAllForms() {
        return feedbackFormRepository.findAll();
    }
}
