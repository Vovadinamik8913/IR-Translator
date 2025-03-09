package ru.ir.translator.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.ir.translator.model.Project;
import ru.ir.translator.model.User;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    Optional<Project> findByUserAndName(User user, String name);
    Optional<List<Project>> findAllByUser(User user);
}
