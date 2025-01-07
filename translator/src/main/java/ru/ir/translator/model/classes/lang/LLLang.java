package ru.ir.translator.model.classes.lang;

import lombok.Getter;

import java.util.stream.Stream;

@Getter
public enum LLLang {
    ASM(100, "s", "ASM"),
    IR(200, "ll", "LLVM IR")
    JBC(300, "class", "JBC");

    private final int code;
    private final String extension;
    private final String name;
    LLLang(int i, String s, String assembler) {
        code = i;
        extension = s;
        name = assembler;
    }

    public static LLLang of(int code) throws IllegalArgumentException {
        return Stream.of(LLLang.values())
                .filter(l -> l.code  == code)
                .findFirst()
                .orElseThrow(IllegalArgumentException::new);
    }

    public static LLLang of(String name) throws IllegalArgumentException {
        return Stream.of(LLLang.values())
                .filter(l -> l.name.equals(name))
                .findFirst()
                .orElseThrow(IllegalArgumentException::new);
    }
}
