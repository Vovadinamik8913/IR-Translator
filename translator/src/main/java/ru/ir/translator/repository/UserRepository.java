package ru.ir.translator.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.ir.translator.model.User;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByLogin(String login);
    Optional<User> findByUuid(UUID uuid);
}
