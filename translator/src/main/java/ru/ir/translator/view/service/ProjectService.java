package ru.ir.translator.view.service;

import jakarta.annotation.Nullable;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.ir.translator.model.classes.Project;
import ru.ir.translator.model.classes.User;
import ru.ir.translator.model.classes.files.Code;
import ru.ir.translator.model.classes.files.Representation;
import ru.ir.translator.model.repository.CodeRepository;
import ru.ir.translator.model.repository.ProjectRepository;
import ru.ir.translator.model.repository.RepresentationRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final CodeRepository codeRepository;
    private final RepresentationRepository representationRepository;

    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    public Code addCode(Code code) {
        return codeRepository.save(code);
    }

    public Representation addRepresentation(Representation representation) {
        return representationRepository.save(representation);
    }


    @Nullable
    public Project getProject(User user, String projectName) {
        return projectRepository.findByUserAndName(user, projectName).orElse(null);
    }

    public List<Project> getProjects(User user) {
        return projectRepository.findAllByUser(user).orElse(new ArrayList<>());
    }

    @Nullable
    public Code getCode(Code code) {
        return codeRepository.findById(code.getId()).orElse(null);
    }

    @Nullable
    public Representation getRepresentation(Representation representation) {
        return representationRepository.findById(representation.getId()).orElse(null);
    }

    public List<Code> getCodes(Project project) {
        return codeRepository.findAllByProject(project).orElse(new ArrayList<>());
    }

    public List<Representation> getRepresentations(Project project) {
        return representationRepository.findAllByProject(project).orElse(new ArrayList<>());
    }

    @Transactional
    public void deleteProject(User user, String name) {
        projectRepository.deleteByUserAndName(user, name);
    }

    public void deleteCode(Code code) {
        codeRepository.deleteById(code.getId());
    }

    public void deleteRepresentation(Representation representation) {
        representationRepository.deleteById(representation.getId());
    }
}
