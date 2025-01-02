package ru.ir.translator.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.ir.translator.model.classes.Project;
import ru.ir.translator.model.classes.files.Code;

import java.util.List;
import java.util.Optional;

public interface CodeRepository extends JpaRepository<Code, Long> {
    Optional<Code> findByProject(Project project);
    Optional<List<Code>> findAllByProject(Project project);
}
