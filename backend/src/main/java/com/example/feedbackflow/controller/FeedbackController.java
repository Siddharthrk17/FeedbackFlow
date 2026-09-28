package com.example.feedbackflow.controller;

import com.example.feedbackflow.dto.*;
import com.example.feedbackflow.model.FeedbackForm;
import com.example.feedbackflow.model.Response;
import com.example.feedbackflow.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "*") // For development frontend
public class FeedbackController {
    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping("/forms")
    public ResponseEntity<FeedbackForm> createFeedbackForm(@Valid @RequestBody FeedbackFormRequestDTO dto) {
        FeedbackForm created = feedbackService.createFeedbackForm(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PostMapping("/responses")
    public ResponseEntity<Response> submitResponse(@Valid @RequestBody ResponseRequestDTO dto) {
        Response created = feedbackService.submitResponse(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/summary/{facultyName}")
    public ResponseEntity<FacultySummaryDTO> getFacultySummary(@PathVariable String facultyName) {
        FacultySummaryDTO summary = feedbackService.getFacultySummary(facultyName);
        return ResponseEntity.ok(summary);
    }
}
