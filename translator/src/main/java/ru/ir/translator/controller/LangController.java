package ru.ir.translator.controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.ir.translator.model.classes.lang.*;
import ru.ir.translator.view.service.LangService;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/lang")
public class LangController {

    private final LangService langService;

    @Operation(summary = "Получение языков")
    @PostMapping(value = "/languages")
    public ResponseEntity<List<String>> getLanguages() {
        List<Language> languages = langService.getLanguages();
        List<String> result = new ArrayList<>();
        for (Language language : languages) {
            if (language.getLang() != Lang.JBC) {
                result.add(language.getLang().getName());
            }
        }
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Получение компилятора")
    @PostMapping(value = "/compilers")
    public ResponseEntity<List<String>> getCompilers(
            @Parameter(description = "Language", required = true) @RequestParam("lang") String lang
    ) {
        Language language = langService.getLanguage(lang);
        System.out.println(language.getLang().getName());
        List<Compiler> compilers = langService.getCompilers(language);
        List<String> result = new ArrayList<>();
        for (Compiler compiler : compilers) {
            result.add(compiler.getName());
        }
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Получение представлений")
    @PostMapping(value = "/representation")
    public ResponseEntity<List<String>> getRepresentations(
            @Parameter(description = "Language", required = true) @RequestParam("compiler") String compiler
    ) {
        Compiler comp = langService.getCompiler(compiler);
        List<LLLanguage> languages = langService.getLLLanguages(comp);
        if (languages == null || languages.isEmpty()) {
            return ResponseEntity.ok(new ArrayList<>());
        }
        List<String> result = new ArrayList<>();
        for (LLLanguage language : languages) {
            result.add(language.getType().getName());
        }
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Получение расширения")
    @PostMapping(value = "/code-extension")
    public ResponseEntity<String> getCodeExtension(
            @Parameter(description = "Language", required = true) @RequestParam("lang") String lang
    ) {
        Lang type = Lang.of(lang);
        if (type == null) {
            return ResponseEntity.ofNullable(null);
        }
        return ResponseEntity.ok(type.getExtension());
    }

    @Operation(summary = "Получение расширения")
    @PostMapping(value = "/repr-extension")
    public ResponseEntity<String> getReprExtension(
            @Parameter(description = "Language", required = true) @RequestParam("lang") String lang
    ) {
        LLLang type = LLLang.of(lang);
        if (type == null) {
            return ResponseEntity.ofNullable(null);
        }
        if (type == LLLang.JBC) {
            return ResponseEntity.ok(".txt");
        }
        return ResponseEntity.ok(type.getExtension());
    }
}
