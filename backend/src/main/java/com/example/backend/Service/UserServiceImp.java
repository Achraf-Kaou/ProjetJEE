package com.example.backend.Service;

import com.example.backend.Entity.User;
import com.example.backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImp implements UserService{
    @Autowired
    private UserRepository uRepository;

    @Override
    public ResponseEntity<User> signIn(String email, String password) {
        Optional<User> userOptional =uRepository.findUserByEmail(email);
        if(userOptional.isPresent()) {
            User user = userOptional.get();
            return ResponseEntity.ok().body(user);
        }else{
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }}

    @Override
    public ResponseEntity<List<User>> getUserByName(String firstName ,String lastName) {
        List<User> oFN = uRepository.findUserByLastName(firstName);
        List<User> oLN = uRepository.findUserByFirstName(lastName);
        List<User> users = new ArrayList<>();
        users.addAll(oFN);
        users.addAll(oLN);
        users = users.stream().distinct().toList();
        if (users.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }else{
            return ResponseEntity.status(HttpStatus.OK).body(users);
        }
    }

    @Override
    public ResponseEntity<User> getUserById(Long idUser) {
        Optional<User> oUser = uRepository.findById(idUser);
        if(oUser.isPresent()) {
            User user = oUser.get();
            return ResponseEntity.ok().body(user);
        }else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @Override
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.status(HttpStatus.OK).body(uRepository.findAll());
    }

    @Override
    public ResponseEntity<?> signUp(User user) {
        Optional<User> oUser = uRepository.findUserByEmail(user.getEmail());
        if(oUser.isPresent()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email already exist");
        }
        return ResponseEntity.status(HttpStatus.OK).body(uRepository.save(user));
    }

    @Override
    public ResponseEntity<User> updateUser(User user) {
        return ResponseEntity.status(HttpStatus.OK).body(uRepository.save(user));
    }

    @Override
    public ResponseEntity<String> deleteUser(Long idUser) {
        uRepository.deleteById(idUser);
        return ResponseEntity.ok().body("Adherent not found");
    }

}

