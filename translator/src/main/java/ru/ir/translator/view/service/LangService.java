package ru.ir.translator.view.service;

import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.ir.translator.model.classes.lang.*;
import ru.ir.translator.model.repository.CompReprRepository;
import ru.ir.translator.model.repository.CompilerRepository;
import ru.ir.translator.model.repository.LLLangRepository;
import ru.ir.translator.model.repository.LangRepository;

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

    public List<LLLanguage> getLLLanguages() {
        return llLangRepository.findAll();
    }

    @Nullable
    public Compiler getCompiler(Language lang) {
        return compilerRepository.findByLanguage(lang).orElse(null);
    }

    @Nullable
    public String getSpecialFlags(Compiler compiler, LLLanguage llLang) {
        CompilerRepresentation compilerRepresentation = compReprRepository.findByCompilerAndLllanguage(compiler, llLang).orElse(null);
        if (compilerRepresentation == null) {
            return null;
        }
        return compilerRepresentation.getSpecialFlags();
    }
}
