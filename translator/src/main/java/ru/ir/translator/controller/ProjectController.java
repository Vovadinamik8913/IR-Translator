package ru.ir.translator.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.ir.translator.LocalConfig;
import ru.ir.translator.model.Project;
import ru.ir.translator.model.User;
import ru.ir.translator.service.FileService;
import ru.ir.translator.service.ProjectService;
import ru.ir.translator.service.UserService;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/project")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;
    private final UserService userService;
    private final FileService fileService;

    @Operation(summary = "создание нового проекта")
    @PostMapping("/create")
    public ResponseEntity<Project> createProject(
            @Parameter(description = "User", required = true) @RequestParam("user") UUID userId,
            @Parameter(description = "Project", required = true) @RequestParam("project") String projectName
    ) {
        User user = userService.get(userId);
        if (user == null) {
            return ResponseEntity.ofNullable(null);
        }
        long cnt = projectService.getWithSameName(user, projectName);
        String name = projectName;
        if (cnt > 0) {
            name += "(" + cnt + ")";
        }
        Project project = new Project(name, user);
        project = projectService.createProject(project);
        if (project == null) {
            return ResponseEntity.ofNullable(null);
        }
        String path = LocalConfig.getInstance().getWorkPath()
                + File.separator + user.getUuid()
                + File.separator + projectName;
        File projectDir = new File(path);
        if (!projectDir.exists()) {
            projectDir.mkdirs();
        }
        return ResponseEntity.ok(project);
    }

    @Operation(summary = "получить проект")
    @PostMapping("/get")
    public ResponseEntity<List<Project>> getProjects(
            @Parameter(description = "User", required = true) @RequestParam("user") UUID userId
    ) {
        User user = userService.get(userId);
        if (user == null) {
            return ResponseEntity.ofNullable(null);
        }
        List<Project> projects = projectService.getProjects(user);
        if (projects == null) {
            return ResponseEntity.ofNullable(null);
        }
        return ResponseEntity.ok(projects);
    }

    @Operation(summary = "создание нового проекта")
    @PostMapping("/delete")
    public ResponseEntity<?> deleteProject(
            @Parameter(description = "User", required = true) @RequestParam("user") UUID userId,
            @Parameter(description = "Project", required = true) @RequestParam("project") String projectName
    ) {
        User user = userService.get(userId);
        if (user == null) {
            return ResponseEntity.badRequest().build();
        }
        Project project = projectService.getProject(user, projectName);
        if (project == null) {
            return ResponseEntity.badRequest().build();
        }

        fileService.deleteRepresentations(project);
        fileService.deleteCodes(project);


        projectService.deleteProject(project);

        String path = LocalConfig.getInstance().getWorkPath()
                + File.separator + user.getUuid()
                + File.separator + projectName;
        File dir = new File(path);
        if (dir.exists()) {
            try {
                FileUtils.cleanDirectory(dir);
                dir.delete();
            } catch (IOException e) {
                System.out.println(e.getMessage());
            }
        }
        return ResponseEntity.ok().build();
    }
}
