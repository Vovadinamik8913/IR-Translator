package ru.ir.translator.model.files;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import ru.ir.translator.model.Project;
import ru.ir.translator.model.lang.Language;

@Entity
@Getter
public class Code extends File {
    @ManyToOne @JoinColumn(name = "language_id")
    @Setter
    private Language language;

    @OneToOne(mappedBy = "code", cascade = CascadeType.ALL)
    private Representation representation;

    public Code() {}
    public Code(String name, String path, Project project, Language language) {
        super(name, path, project);
        this.language = language;
    }
}
