package com.example.backend.Service;

public interface EmailService {
    public void sendEmail(String to, String subject, String text);
}
