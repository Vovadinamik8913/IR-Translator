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
import ru.ir.translator.model.classes.files.Code;
import ru.ir.translator.model.classes.files.Representation;
import ru.ir.translator.model.classes.lang.*;
import ru.ir.translator.view.service.LangService;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/translate")
public class TranslatorController {

    private final LangService langService;

    @Nullable
    private CompilerRepresentation getCompilerRepresentation(
            String compilerName, String langName, String[] flags) {
        Compiler compiler = langService.getCompiler(compilerName);
        if (compiler == null ) {
            return null;
        }

        LLLanguage language = langService.getLLLanguage(langName);
        if (language == null) {
            return null;
        }

        CompilerRepresentation compilerRepresentation = langService.getCompilerRepr(compiler, language);
        compilerRepresentation = CompilerExecution.select(
                langService.getCompRepresentations(compiler),
                compilerRepresentation,
                flags
        );
        return compilerRepresentation;
    }

    private void create(byte[] src, String name, String path) throws IOException {
        File file;
        if (!path.isEmpty()) {
            file = new File(path);
            if (!file.exists()) {
                file.mkdir();
            }
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

    private void delete(String path, String name) throws IOException {
        if (path.isEmpty() && name.isEmpty()) {
            return;
        }
        if (name.isEmpty()) {
            new File(path).delete();
        }
        if (path.isEmpty()) {
            new File(name).delete();
        } else {
            new File(path + File.separator + name).delete();
        }
    }

    @Nullable
    private byte[] translate(byte[] src, String fileName, String path,
                                 Language language, CompilerRepresentation compilerRepresentation,
                                 List<String> flags) throws IOException {
        byte[] bytes;
        create(src, fileName, path);
        Code code = new Code(fileName, path, null, language);
        Representation representation = CompilerExecution.compile(compilerRepresentation, code, flags);
        if (representation != null && representation.getLanguage().getType() == LLLang.JBC) {
            delete(code.getPath(), code.getName());
            String version = compilerRepresentation.getCompiler().getName();
            version = version.substring(version.indexOf("-"));
            String compiler = "javap" + version;
            CompilerRepresentation tmp = getCompilerRepresentation(
                    compiler, "Text", new String[]{}
            );
            Language newLang = langService.getLanguage("JBC");
            if (tmp != null && newLang != null) {
                code = new Code(representation.getName(), representation.getPath(), null, newLang);
                representation = CompilerExecution.compile(tmp, code, new ArrayList<>());
            }
        }
        delete(code.getPath(), code.getName());
        if (representation == null) {
            return null;
        }
        File file;
        if (representation.getPath().isEmpty()) {
            file = new File(representation.getName());
        } else {
            file = new File(representation.getPath() + File.separator + representation.getName());
        }
        bytes = Files.readAllBytes(file.toPath());
        file.delete();
        delete(representation.getPath(), "");
        return  bytes;
    }

    private String getFilename(Lang language, MultipartFile file) {
        if (language != Lang.JAVA) {
            return UUID.randomUUID() + language.getExtension();
        }
        
        return file.getOriginalFilename().substring(0, file.getOriginalFilename().lastIndexOf("."))
                + language.getExtension();
    }

    @Operation(summary = "Получение представления")
    @PostMapping
    public ResponseEntity<byte[]> translate(
            @Parameter(description = "Language") @RequestParam("language") String languageName,
            @Parameter(description = "Compiler", required = true) @RequestParam("compiler") String compilerName,
            @Parameter(description = "Representation", required = true) @RequestParam("representation") String representationName,
            @Parameter(description = "Flags") @RequestParam("flags") String[] flags,
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

        CompilerRepresentation compilerRepresentation = getCompilerRepresentation(compilerName, representationName, flags);
        if (compilerRepresentation == null
                || !CompilerExecution.validate(compilerRepresentation.getCompiler())) {
            return ResponseEntity.badRequest().build();
        }

        String path = "";
        if (lang == Lang.JAVA) {
            path = UUID.randomUUID().toString();
        }
        String fileName = getFilename(lang, file);
        fileName = fileName.replace("-", "_");
        byte[] bytes;
        try {
            bytes = translate(file.getBytes(), fileName, path,
                    language, compilerRepresentation, List.of(flags));
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(bytes);
    }


}
