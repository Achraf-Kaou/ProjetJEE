package com.example.backend.Controller;

import com.example.backend.Entity.User;
import com.example.backend.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RequestMapping("/user")
@RestController
public class UserController {

    @Autowired
    private UserService uService;
    @GetMapping("/getUserByName")
    public ResponseEntity<List<User>> getUserByName(@RequestParam String firstName , @RequestParam String lastName ) {
        return uService.getUserByName(firstName , lastName);
    }
    @GetMapping("/getUserById/{idUser}")
    public ResponseEntity<User> getUserById(@PathVariable Long idUser) {
        return uService.getUserById(idUser);
    }
    @GetMapping("/getAllUsers")
    public ResponseEntity<List<User>> getAllUsers() {
        return uService.getAllUsers();
    }
    @DeleteMapping("/deleteUser/{idUser}")
    public ResponseEntity<String> deleteUser(@PathVariable Long idUser) {
        return uService.deleteUser(idUser);
    }
    @PostMapping("/signIn")
    public ResponseEntity<User> signIn(@RequestParam String email , @RequestParam String password){
        return uService.signIn(email , password);
    }
    @PostMapping("/signUp")
    public ResponseEntity<?> signIn(@RequestBody User user){
        return uService.signUp(user);
    }
    @PutMapping("/updateUser")
    public ResponseEntity<User> updateUser(@RequestBody User user){
        return uService.updateUser(user);
    }
}
