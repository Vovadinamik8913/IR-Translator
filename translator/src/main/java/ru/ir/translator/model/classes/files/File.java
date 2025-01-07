package ru.ir.translator.model.classes.files;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import ru.ir.translator.model.classes.lang.Compiler;
import ru.ir.translator.model.classes.Project;

@MappedSuperclass
@Getter
@Setter
public abstract class File {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String path;
    @ManyToOne @JoinColumn(name = "project_id")
    private Project project;

    public File() {}
    public File(String name, String path, Project project) {
        this.name = name;
        this.path = path;
        this.project = project;
    }
}
