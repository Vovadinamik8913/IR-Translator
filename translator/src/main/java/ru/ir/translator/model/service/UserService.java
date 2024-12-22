package ru.ir.translator.model.service;

import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import ru.ir.translator.model.classes.User;
import ru.ir.translator.model.repository.UserRepository;

@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public void create(User user) {
        userRepository.save(user);
    }

    @Nullable
    public User get(String login, String password) {
        User user = userRepository.findByLogin(login).orElse(null);
        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }

    public void update(User user) {
        userRepository.save(user);
    }

    public void deleteById(long id) {
        userRepository.deleteById(id);
    }
}
