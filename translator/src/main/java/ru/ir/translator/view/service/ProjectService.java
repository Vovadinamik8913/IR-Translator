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
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;

    public Project createProject(Project project) {
        return projectRepository.save(project);
    }


    @Nullable
    public Project getProject(User user, String projectName) {
        return projectRepository.findByUserAndName(user, projectName).orElse(null);
    }

    public List<Project> getProjects(User user) {
        return projectRepository.findAllByUser(user).orElse(new ArrayList<>());
    }

    @Transactional
    public void deleteProject(Project project) {
        projectRepository.delete(project);
    }

    public long getWithSameName(User user, String projectName) {
        List<Project> projects = getProjects(user);
        Pattern special = Pattern.compile("^" + projectName + "(\\(\\d+\\))?$");
        long cnt = 0;
        for (Project project : projects) {
            Matcher hasSame = special.matcher(project.getName());
            if (hasSame.matches()) {
                cnt++;
            }
        }
        return cnt;
    }

}
