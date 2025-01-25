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
import ru.ir.translator.model.repository.RepresentationRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class FileService {
    private final CodeRepository codeRepository;
    private final RepresentationRepository representationRepository;

    public Code addCode(Code code) {
        return codeRepository.save(code);
    }

    public Representation addRepresentation(Representation representation) {
        return representationRepository.save(representation);
    }

    @Nullable
    public Representation getRepresentation(Project project,long id) {
        return representationRepository.findByProjectAndId(project, id).orElse(null);
    }

    public List<Code> getCodes(Project project) {
        return codeRepository.findAllByProject(project).orElse(new ArrayList<>());
    }

    public List<Representation> getRepresentations(Project project) {
        return representationRepository.findAllByProject(project).orElse(new ArrayList<>());
    }

    @Transactional
    public void deleteCode(Code code) {
        codeRepository.deleteById(code.getId());
    }

    @Transactional
    public void deleteRepresentation(Representation representation) {
        representationRepository.deleteById(representation.getId());
    }

    @Transactional
    public void deleteCodes(Project project) {
        codeRepository.deleteAllByProject(project);
    }

    @Transactional
    public void deleteRepresentations(Project project) {
        representationRepository.deleteAllByProject(project);
    }

    public long getWithSameName(Project project, String name) {
        List<Representation> representations = getRepresentations(project);
        Pattern special = Pattern.compile("^" + name + "(\\(\\d+\\))?$");
        long cnt = 0;
        for (Representation representation : representations) {
            Matcher hasSame = special.matcher(
                    representation.getName().substring(0, representation.getName().lastIndexOf("."))
            );
            if (hasSame.matches()) {
                cnt++;
            }
        }
        return cnt;
    }
}
