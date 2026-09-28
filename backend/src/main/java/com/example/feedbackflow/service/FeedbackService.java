package com.example.feedbackflow.service;

import com.example.feedbackflow.dto.*;
import com.example.feedbackflow.model.*;
import com.example.feedbackflow.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeedbackService {
    private final CourseRepository courseRepository;
    private final FeedbackFormRepository feedbackFormRepository;
    private final QuestionRepository questionRepository;
    private final ResponseRepository responseRepository;
    private final AnswerRepository answerRepository;

    public FeedbackService(CourseRepository courseRepository, FeedbackFormRepository feedbackFormRepository, QuestionRepository questionRepository, ResponseRepository responseRepository, AnswerRepository answerRepository) {
        this.courseRepository = courseRepository;
        this.feedbackFormRepository = feedbackFormRepository;
        this.questionRepository = questionRepository;
        this.responseRepository = responseRepository;
        this.answerRepository = answerRepository;
    }

    @Transactional
    public FeedbackForm createFeedbackForm(FeedbackFormRequestDTO dto) {
        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));

        FeedbackForm form = new FeedbackForm();
        form.setCourse(course);
        form.setSemester(dto.getSemester());
        form.setClosingDate(dto.getClosingDate());

        for (String qText : dto.getQuestions()) {
            Question q = new Question();
            q.setText(qText);
            q.setFeedbackForm(form);
            form.getQuestions().add(q);
        }

        return feedbackFormRepository.save(form);
    }

    @Transactional
    public Response submitResponse(ResponseRequestDTO dto) {
        FeedbackForm form = feedbackFormRepository.findById(dto.getFeedbackFormId())
                .orElseThrow(() -> new IllegalArgumentException("Feedback form not found"));

        if (LocalDate.now().isAfter(form.getClosingDate())) {
            throw new IllegalStateException("Feedback collection for this form has closed.");
        }

        if (responseRepository.existsByStudentIdAndFeedbackFormId(dto.getStudentId(), form.getId())) {
            throw new IllegalStateException("Student has already submitted a response for this form.");
        }

        Response response = new Response();
        response.setFeedbackForm(form);
        response.setStudentId(dto.getStudentId());
        response.setSubmittedAt(LocalDateTime.now());

        for (Question question : form.getQuestions()) {
            Integer rating = dto.getAnswers().get(question.getId());
            if (rating == null || rating < 1 || rating > 5) {
                throw new IllegalArgumentException("Valid rating (1-5) required for question ID: " + question.getId());
            }
            Answer answer = new Answer();
            answer.setQuestion(question);
            answer.setResponse(response);
            answer.setRating(rating);
            response.getAnswers().add(answer);
        }

        return responseRepository.save(response);
    }

    public FacultySummaryDTO getFacultySummary(String facultyName) {
        List<Course> courses = courseRepository.findByFacultyName(facultyName);
        List<CourseSummaryDTO> courseSummaries = new ArrayList<>();

        for (Course course : courses) {
            List<FeedbackForm> forms = feedbackFormRepository.findByCourseId(course.getId());
            for (FeedbackForm form : forms) {
                List<QuestionSummaryDTO> questionSummaries = new ArrayList<>();
                double totalRating = 0;
                long totalAnswers = 0;
                long totalResponses = 0;

                // For counting responses to this form
                // since we don't have a direct repository method to count by form, 
                // we'll get answers per question
                for (Question question : form.getQuestions()) {
                    List<Answer> answers = answerRepository.findByQuestionId(question.getId());
                    if (answers.isEmpty()) continue;
                    
                    double avgQ = answers.stream().mapToInt(Answer::getRating).average().orElse(0.0);
                    questionSummaries.add(new QuestionSummaryDTO(question.getText(), avgQ));
                    
                    totalRating += answers.stream().mapToInt(Answer::getRating).sum();
                    totalAnswers += answers.size();
                    
                    // All questions in a form have same number of answers (responses), so max is total responses
                    totalResponses = Math.max(totalResponses, answers.size());
                }

                double overallAvg = totalAnswers > 0 ? totalRating / totalAnswers : 0.0;

                courseSummaries.add(new CourseSummaryDTO(
                        course.getId(), course.getCourseCode(), course.getTitle(), 
                        form.getSemester(), overallAvg, questionSummaries, totalResponses
                ));
            }
        }

        return new FacultySummaryDTO(facultyName, courseSummaries);
    }
}
