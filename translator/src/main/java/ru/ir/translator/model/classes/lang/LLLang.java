package ru.ir.translator.model.classes.lang;

import lombok.Getter;

import java.util.stream.Stream;

@Getter
public enum LLLang {
    ASM(".s", "ASM"),
    IR(".ll", "LLVM IR"),
    JBC(".class", "JBC"),
    TEXT(".txt", "Text"),;

    private final String extension;
    private final String name;
    LLLang(String s, String assembler) {
        extension = s;
        name = assembler;
    }

    public static LLLang of(String name) throws IllegalArgumentException {
        return Stream.of(LLLang.values())
                .filter(l -> l.name.equals(name))
                .findFirst()
                .orElseThrow(IllegalArgumentException::new);
    }
}
