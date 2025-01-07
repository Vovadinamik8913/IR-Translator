package ru.ir.translator.logic;

import jakarta.annotation.Nullable;
import ru.ir.translator.model.classes.files.Code;
import ru.ir.translator.model.classes.files.Representation;
import ru.ir.translator.model.classes.lang.Compiler;
import ru.ir.translator.model.classes.lang.CompilerRepresentation;
import ru.ir.translator.model.classes.lang.LLLanguage;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class CompilerExecution {
    @Nullable
    public static Representation compile(CompilerRepresentation compilerRepresentation, Code code, String userFlags) throws IOException {
        String path = code.getPath();
        File dir = new File(path);
        String[] innerFlags = null;
        if (!compilerRepresentation.getSpecialFlags().isEmpty()) {
            innerFlags = compilerRepresentation.getSpecialFlags().split(" ");
        }
        String[] outerFlags = null;
        if (!userFlags.isEmpty()) {
            outerFlags = userFlags.split(" ");
        }

        List<String> args = new ArrayList<>();
        args.add(compilerRepresentation.getCompiler().getPath());
        args.addAll(combineFlags(innerFlags, outerFlags));
        args.add(code.getName());

        ProcessBuilder processBuilder = new ProcessBuilder(args);
        if (!path.isEmpty()) {
            processBuilder.directory(dir);
        }
        processBuilder.inheritIO();
        Process process = processBuilder.start();
        try {
            process.waitFor();
        } catch (InterruptedException e) {
            throw new IOException("Interrupted while waiting for process to finish");
        }
        if (process.exitValue() == 0) {
            Representation result = new Representation();
            result.setName(
                    code.getName().substring(0, code.getName().lastIndexOf('.'))
                    + "." + compilerRepresentation.getLllanguage().getType().getExtension()
            );
            result.setCompiler(compilerRepresentation.getCompiler());
            result.setPath(path);
            result.setLanguage(compilerRepresentation.getLllanguage());
            return result;
        }
        return null;
    }

    public static boolean validate(Compiler compiler) {
        try {
            Runtime runtime = Runtime.getRuntime();
            Process process = runtime.exec(new String[] {compiler.getPath(), "--version"});
            boolean result = process.waitFor(1, java.util.concurrent.TimeUnit.SECONDS);
            process.destroyForcibly();
            return result;
        } catch (IOException | InterruptedException e) {
            return false;
        }
    }

    public static List<String> combineFlags(String[] innerFlags, String[] outerFlags) {
        Set<String> flags = new HashSet<>();
        if (innerFlags != null) {
            flags.addAll(List.of(innerFlags));
        }
        if (outerFlags != null) {
            flags.addAll(List.of(outerFlags));
        }
        return new ArrayList<>(flags);
    }
}
