package ru.ir.translator.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.ir.translator.model.classes.Project;
import ru.ir.translator.model.classes.files.Representation;

import java.util.List;
import java.util.Optional;

public interface RepresentationRepository extends JpaRepository<Representation, Long> {
    Optional<Representation> findByProject(Project project);
    Optional<List<Representation>> findAllByProject(Project project);
}
