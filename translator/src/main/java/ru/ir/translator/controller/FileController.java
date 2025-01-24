package ru.ir.translator.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import ru.ir.translator.LocalConfig;
import ru.ir.translator.model.classes.Project;
import ru.ir.translator.model.classes.User;
import ru.ir.translator.model.classes.files.Code;
import ru.ir.translator.model.classes.files.Representation;
import ru.ir.translator.model.classes.lang.Compiler;
import ru.ir.translator.model.classes.lang.LLLanguage;
import ru.ir.translator.model.classes.lang.Language;
import ru.ir.translator.request.FileResponse;
import ru.ir.translator.view.service.LangService;
import ru.ir.translator.view.service.ProjectService;
import ru.ir.translator.view.service.UserService;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/file")
@RequiredArgsConstructor
public class FileController {
    private final UserService userService;
    private final ProjectService projectService;
    private final LangService langService;

    private void create(byte[] src, String path) throws IOException {
        File file = new File(path);
        if (!file.exists()) {
            file.createNewFile();
            BufferedOutputStream stream =
                    new BufferedOutputStream(new FileOutputStream(file));
            stream.write(src);
            stream.close();
        }
    }


    @Operation(summary = "сохранить файлы")
    @PostMapping("/save")
    public ResponseEntity<FileResponse> save(
            @Parameter(description = "User", required = true) @RequestParam("user") UUID userId,
            @Parameter(description = "Project") @RequestParam("project") String projectName,
            @Parameter(description = "FileName") @RequestParam("name") String name,
            @Parameter(description = "Language") @RequestParam("language") String languageName,
            @Parameter(description = "Compiler", required = true) @RequestParam("compiler") String compilerName,
            @Parameter(description = "Representation", required = true) @RequestParam("reprLang") String representationLanguage,
            @Parameter(description = "Flags") @RequestParam("flags") String[] flags,
            @Parameter(description = "Code", required = true) @RequestParam("code") MultipartFile code,
            @Parameter(description = "Representation", required = true) @RequestParam("representation") MultipartFile representation
    ) {

        User user = userService.get(userId);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        Language language = langService.getLanguage(languageName);
        if (language == null) {
            return ResponseEntity.notFound().build();
        }

        LLLanguage llLanguage = langService.getLLLanguage(representationLanguage);
        if (llLanguage == null) {
            return ResponseEntity.notFound().build();
        }

        Compiler compiler = langService.getCompiler(compilerName);
        if (compiler == null) {
            return ResponseEntity.notFound().build();
        }

        Project project = projectService.getProject(user, projectName);
        if (project == null) {
            return ResponseEntity.notFound().build();
        }

        String path = LocalConfig.getInstance().getWorkPath()
                + File.separator + user.getUuid()
                + File.separator + projectName;

        Code fileCode = new Code(
                name + language.getLang().getExtension(),
                path,
                project,
                language
            );

        File codeFile = new File(fileCode.getPath() + File.separator + fileCode.getName());
        try {
            create(code.getBytes(), codeFile.getAbsolutePath());
        } catch (IOException e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
        projectService.addCode(fileCode);


        Representation fileRepr = new Representation(
                name + llLanguage.getType().getExtension(),
                path,
                project,
                llLanguage,
                compiler,
                fileCode,
                List.of(flags)
        );
        try {
            create(representation.getBytes(), fileRepr.getAbsolutePath());
        } catch (IOException e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
        fileRepr = projectService.addRepresentation(fileRepr);

        FileResponse fileResponse = new FileResponse();
        fileResponse.setId(fileRepr.getId());
        fileResponse.setCompiler(compilerName);
        fileResponse.setSpecialFlags(fileRepr.getSpecialFlags());
        fileResponse.setName(name);
        fileResponse.setCodeLang(languageName);
        fileResponse.setReprLang(representationLanguage);

        return ResponseEntity.ok(fileResponse);
    }

    @Operation(summary = "получить файлы")
    @PostMapping("/get")
    public ResponseEntity<List<FileResponse>> save(
            @Parameter(description = "User", required = true) @RequestParam("user") UUID userId,
            @Parameter(description = "Project") @RequestParam("project") String projectName
    ) {
        User user = userService.get(userId);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        Project project = projectService.getProject(user, projectName);
        if (project == null) {
            return ResponseEntity.notFound().build();
        }

        List<FileResponse> res = new ArrayList<>();
        List<Representation> representations = projectService.getRepresentations(project);

        for (Representation representation : representations) {
            FileResponse fileResponse = new FileResponse(
                    representation.getId(),
                    representation.getName().substring(0, representation.getName().lastIndexOf(".")),
                    representation.getCode().getLanguage().getName(),
                    representation.getLanguage().getName(),
                    representation.getCompiler().getName(),
                    representation.getSpecialFlags()
            );
            res.add(fileResponse);
        }
        return ResponseEntity.ok(res);
    }

    @Operation(summary = "импортировать файлы")
    @PostMapping("/load")
    public ResponseEntity<FileResponse> load(
            @Parameter(description = "User", required = true) @RequestParam("user") UUID userId,
            @Parameter(description = "Project") @RequestParam("project") String projectName,
            @Parameter(description = "File") @RequestParam("file") int id
    ) {
        User user = userService.get(userId);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        Project project = projectService.getProject(user, projectName);
        if (project == null) {
            return ResponseEntity.notFound().build();
        }

        List<Representation> representations = projectService.getRepresentations(project);
        if (representations.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Representation representation = representations.stream()
                .filter(repr -> repr.getId() == id).findFirst().orElse(null);
        if (representation == null) {
            return ResponseEntity.notFound().build();
        }

        FileResponse fileResponse = new FileResponse(
                representation.getId(),
                representation.getName().substring(0, representation.getName().lastIndexOf(".")),
                representation.getCode().getLanguage().getName(),
                representation.getLanguage().getName(),
                representation.getCompiler().getName(),
                representation.getSpecialFlags()
        );

        byte[] file;
        try {
            file = Files.readAllBytes(new File(representation.getCode().getAbsolutePath()).toPath());
            fileResponse.setCode(file);
            file = Files.readAllBytes(new File(representation.getAbsolutePath()).toPath());
            fileResponse.setRepresentation(file);
        } catch (IOException e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(fileResponse);
    }
}
