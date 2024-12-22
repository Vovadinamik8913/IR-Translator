package ru.ir.translator.model.classes.lang;

import jakarta.persistence.*;
import lombok.Getter;

import java.util.List;

@Entity
@Getter
public class Compiler {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String name;
    private String path;

    @ManyToMany @JoinTable(
            name = "compiler_language", // Имя промежуточной таблицы
            joinColumns = @JoinColumn(name = "language_id"), // Внешний ключ для Language
            inverseJoinColumns = @JoinColumn(name = "compiler_id") // Внешний ключ для Compiler
    )
    private List<Language> language;

    @OneToMany(mappedBy = "compiler")
    private List<CompilerRepresentation> compilerRepresentations;
}
