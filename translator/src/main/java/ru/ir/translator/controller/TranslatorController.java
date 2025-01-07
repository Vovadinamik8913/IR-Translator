package ru.ir.translator.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import ru.ir.translator.logic.CompilerExecution;
import ru.ir.translator.model.classes.Project;
import ru.ir.translator.model.classes.files.Code;
import ru.ir.translator.model.classes.files.Representation;
import ru.ir.translator.model.classes.lang.*;
import ru.ir.translator.view.service.LangService;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/translate")
public class TranslatorController {

    private final LangService langService;

    @Nullable
    private CompilerRepresentation getCompilerRepresentation(String compilerName, String langName) {
        Compiler compiler = langService.getCompiler(compilerName);
        if (compiler == null ) {
            return null;
        }

        LLLanguage language = langService.getLLLanguage(langName);
        if (language == null) {
            return null;
        }

        return langService.getCompilerRepr(compiler, language);
    }

    private void create(byte[] src, String name, String path) throws IOException {
        File file;
        if (!path.isEmpty()) {
            file = new File(path + File.separator + name);
        } else {
            file = new File(name);
        }
        if (!file.exists()) {
            file.createNewFile();
        }
        BufferedOutputStream stream =
                new BufferedOutputStream(new FileOutputStream(file));
        stream.write(src);
        stream.close();
    }

    private Code create(String name, String path, Project project, Language language) {
        Code code = new Code(name, path, project, language);
        return code;
    }

    @Nullable
    private byte[] fastTranslate(byte[] src, String fileName,
                                 Language language, CompilerRepresentation compilerRepresentation,
                                 String flags) throws IOException {
        byte[] bytes;
        create(src, fileName, "");
        Code code = create(fileName, "", null, language);
        Representation representation = CompilerExecution.compile(compilerRepresentation, code, flags);
        new File(fileName).delete();
        if (representation == null) {
            return null;
        }
        Path dirPath = Paths.get(representation.getName());
        bytes = Files.readAllBytes(dirPath);
        new File(representation.getName()).delete();
       return  bytes;
    }

    @Operation(summary = "Получение представления")
    @PostMapping
    public ResponseEntity<byte[]> translate(
            @Parameter(description = "User") @RequestParam(value = "user", required = false) UUID userId,
            @Parameter(description = "Project") @RequestParam(value = "project", required = false) String projectName,
            @Parameter(description = "Language") @RequestParam("language") String languageName,
            @Parameter(description = "Compiler", required = true) @RequestParam("compiler") String compilerName,
            @Parameter(description = "Representation", required = true) @RequestParam("representation") String representationName,
            @Parameter(description = "Flags") @RequestParam("flags") String flags,
            @Parameter(description = "Code", required = true) @RequestParam("code") MultipartFile file
    ) {
        Lang lang = Lang.of(languageName);
        if (lang == null) {
            return ResponseEntity.badRequest().build();
        }
        Language language = langService.getLanguage(languageName);
        if (language == null) {
            return ResponseEntity.badRequest().build();
        }

        CompilerRepresentation compilerRepresentation = getCompilerRepresentation(compilerName, representationName);
        if (compilerRepresentation == null
                || !CompilerExecution.validate(compilerRepresentation.getCompiler())) {
            return ResponseEntity.badRequest().build();
        }

        String fileName = UUID.randomUUID() + "." + lang.getExtension();
        fileName = fileName.replace("-", "_");
        byte[] bytes;
        if (userId == null || projectName == null) {
            try {
                bytes = fastTranslate(file.getBytes(), fileName,
                        language, compilerRepresentation, flags);
            } catch (IOException e) {
                return ResponseEntity.badRequest().build();
            }
            return ResponseEntity.ok(bytes);
        }
        return ResponseEntity.badRequest().build();
    }
}
