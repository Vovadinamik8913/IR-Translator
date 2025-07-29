package ru.ir.translator.service;

import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ru.ir.translator.model.User;
import ru.ir.translator.repository.UserRepository;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public void create(User user) {
        if (userRepository.findByLogin(user.getLogin()).isEmpty()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            userRepository.save(user);
        }
    }

    @Nullable
    public User get(String login, String password) {
        User user = userRepository.findByLogin(login).orElse(null);
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            return user;
        }
        return null;
    }

    @Nullable
    public User get(String login) {
        return userRepository.findByLogin(login).orElse(null);
    }

    @Nullable
    public User get(UUID id) {
        return userRepository.findByUuid(id).orElse(null);
    }


    public void update(User user) {
        userRepository.save(user);
    }

    public void deleteById(long id) {
        userRepository.deleteById(id);
    }
}
