package com.example.backend.Repository;


import com.example.backend.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findUserByEmail(String email);
    List<User> findUserByFirstName(String firstname);
    List<User> findUserByLastName(String lastname);

}
