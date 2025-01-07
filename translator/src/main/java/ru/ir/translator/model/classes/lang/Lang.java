package ru.ir.translator.model.classes.lang;

import lombok.Getter;

import java.util.stream.Stream;

@Getter
public enum Lang {
    C(100, "c", "c"),
    CPP(200, "cpp", "cpp"),
    RUST(300, "rs", "rust"),
    SWIFT(400, "swift", "swift"),
    HASKELL(500, "hs", "haskell"),
    D(600, "d", "d"),
    JAVA(700, "java", "java"),
    LLVMIR(800, "ll", "LLVM IR");

    private final int code;
    private final String extension;
    private final String name;
    Lang(int i, String s, String s1) {
        code = i;
        extension = s;
        name = s1;
    }

    public static Lang of(String name) throws IllegalArgumentException {
        return Stream.of(Lang.values())
                .filter(l -> l.name.equals(name))
                .findFirst()
                .orElseThrow(IllegalArgumentException::new);
    }


    public static Lang of(int code) throws IllegalArgumentException {
        return Stream.of(Lang.values())
                .filter(l -> l.code  == code)
                .findFirst()
                .orElseThrow(IllegalArgumentException::new);
    }
}
