package ru.ir.translator.model.classes.lang;

import lombok.Getter;

import java.util.stream.Stream;

@Getter
public enum Lang {
    C(100, ".c", "C"),
    CPP(200, ".cpp", "C++"),
    RUST(300, ".rs", "Rust"),
    SWIFT(400, ".swift", "Swift"),
    HASKELL(500, ".hs", "Hashell"),
    D(600, ".d", "D"),;

    private final int code;
    private final String extension;
    private final String name;
    Lang(int i, String s, String s1) {
        code = i;
        extension = s;
        name = s1;
    }


    public static Lang of(int code) throws IllegalArgumentException {
        return Stream.of(Lang.values())
                .filter(l -> l.code  == code)
                .findFirst()
                .orElseThrow(IllegalArgumentException::new);
    }
}
