package ru.ir.translator.view.service;

import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import ru.ir.translator.model.classes.Project;
import ru.ir.translator.model.classes.User;
import ru.ir.translator.model.classes.files.Code;
import ru.ir.translator.model.classes.files.Representation;
import ru.ir.translator.model.repository.CodeRepository;
import ru.ir.translator.model.repository.ProjectRepository;
import ru.ir.translator.model.repository.RepresentationRepository;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final CodeRepository codeRepository;
    private final RepresentationRepository representationRepository;

    public void createProject(Project project) {
        projectRepository.save(project);
    }

    public void addCode(Code code) {
        codeRepository.save(code);
    }

    public void addRepresentation(Representation representation) {
        representationRepository.save(representation);
    }


    @Nullable
    public Project getProject(User user) {
        return projectRepository.findByUser(user).orElse(null);
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

    public void deleteById(long id) {
        Project project = projectRepository.findById(id).orElse(null);
        if (project != null) {
            codeRepository.deleteAll(project.getCode());
            representationRepository.deleteAll(project.getRepresentation());
            projectRepository.delete(project);
        }
    }

    public void deleteCode(Code code) {
        codeRepository.deleteById(code.getId());
    }

    public void deleteRepresentation(Representation representation) {
        representationRepository.deleteById(representation.getId());
    }
}
