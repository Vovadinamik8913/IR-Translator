package ru.ir.translator.view.service;

import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.ir.translator.model.classes.lang.*;
import ru.ir.translator.model.repository.CompReprRepository;
import ru.ir.translator.model.repository.CompilerRepository;
import ru.ir.translator.model.repository.LLLangRepository;
import ru.ir.translator.model.repository.LangRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LangService {
    private final CompilerRepository compilerRepository;
    private final LangRepository langRepository;
    private final LLLangRepository llLangRepository;
    private final CompReprRepository compReprRepository;

    public List<Language> getLanguages() {
        return langRepository.findAll();
    }

    @Nullable
    public Language getLanguage(String language) {
        return langRepository.findByName(language).orElse(null);
    }

    @Nullable
    public LLLanguage getLLLanguage(String language) {
        return llLangRepository.findByName(language).orElse(null);
    }


    public List<LLLanguage> getLLLanguages() {
        return llLangRepository.findAll();
    }

    @Nullable
    public List<LLLanguage> getLLLanguages(Compiler compiler) {
        List<CompilerRepresentation> compilerRepresentations = compReprRepository.findAllByCompiler(compiler).orElse(null);
        if (compilerRepresentations == null) {
            return null;
        }
        final List<LLLanguage> llLanguages = new ArrayList<>();
        for (CompilerRepresentation compilerRepresentation : compilerRepresentations) {
            llLanguages.add(compilerRepresentation.getLllanguage());
        }
        return llLanguages;
    }

    @Nullable
    public Compiler getCompiler(Language lang) {
        return compilerRepository.findByLanguage(lang).orElse(null);
    }

    @Nullable
    public Compiler getCompiler(String name) {
        return compilerRepository.findByName(name).orElse(null);
    }

    public List<Compiler> getCompilers(Language lang) {
        List<Compiler> compilers = compilerRepository.findAll();
        return compilers.stream().filter((compiler -> compiler.getLanguage().contains(lang))).toList();
    }

    @Nullable
    public CompilerRepresentation getCompilerRepr(Compiler compiler, LLLanguage lang) {
        return compReprRepository.findByCompilerAndLllanguage(compiler, lang).orElse(null);
    }
}
