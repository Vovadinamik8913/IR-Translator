package ru.ir.translator.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.ir.translator.model.Project;
import ru.ir.translator.model.files.Representation;

import java.util.List;
import java.util.Optional;

public interface RepresentationRepository extends JpaRepository<Representation, Long> {
    Optional<Representation> findByProjectAndId(Project project, long id);
    Optional<List<Representation>> findAllByProject(Project project);
    void  deleteAllByProject(Project project);
}
