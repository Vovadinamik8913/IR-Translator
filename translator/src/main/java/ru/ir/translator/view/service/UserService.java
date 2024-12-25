package ru.ir.translator.view.service;

import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import ru.ir.translator.model.classes.User;
import ru.ir.translator.model.repository.UserRepository;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public void create(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()).toCharArray());
        userRepository.save(user);
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
