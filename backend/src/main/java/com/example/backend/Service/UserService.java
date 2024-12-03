package com.example.backend.Service;

import com.example.backend.Entity.Review;
import com.example.backend.Entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;


import java.util.List;

public interface UserService {
    ResponseEntity<User> signIn(String email , String password);
    ResponseEntity<List<User>> getUserByName(String firstName ,String lastName);
    ResponseEntity<User> getUserById(Long idUser);
    ResponseEntity<List<User>> getAllUsers();
    ResponseEntity<?> signUp(User user);
    ResponseEntity<User> updateUser(User user);
    ResponseEntity<String> deleteUser(Long idUser);
    
}
