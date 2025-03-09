package ru.ir.translator.controller.request;

import lombok.Getter;
import lombok.Setter;
import org.springframework.core.io.InputStreamResource;

@Getter
@Setter
public class FileResponse {
    private long id;
    private String name;
    private String codeLang;
    private String reprLang;
    private String compiler;
    private String specialFlags;
    private InputStreamResource code;
    private InputStreamResource representation;

    public FileResponse() {}
    public FileResponse(long id, String name, String codeLang, String reprLang, String compiler, String specialFlags) {
        this.id = id;
        this.name = name;
        this.codeLang = codeLang;
        this.reprLang = reprLang;
        this.compiler = compiler;
        this.specialFlags = specialFlags;
    }
}
