package ru.ir.translator.model.classes.lang;

import lombok.Getter;

import java.util.stream.Stream;

@Getter
public enum Lang {
    C("c", "c"),
    CPP("cpp", "cpp"),
    RUST("rs", "rust"),
    SWIFT("swift", "swift"),
    HASKELL("hs", "haskell"),
    D("d", "d"),
    JAVA("java", "java"),
    LLVMIR("ll", "LLVM IR");

    private final String extension;
    private final String name;
    Lang(String s, String s1) {
        extension = s;
        name = s1;
    }

    public static Lang of(String name) throws IllegalArgumentException {
        return Stream.of(Lang.values())
                .filter(l -> l.name.equals(name))
                .findFirst()
                .orElseThrow(IllegalArgumentException::new);
    }
}
