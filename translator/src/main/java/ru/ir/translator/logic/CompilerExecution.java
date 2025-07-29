package ru.ir.translator.logic;

import jakarta.annotation.Nullable;
import ru.ir.translator.model.files.Code;
import ru.ir.translator.model.files.Representation;
import ru.ir.translator.model.lang.Compiler;
import ru.ir.translator.model.lang.CompilerRepresentation;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class CompilerExecution {

    @Nullable
    public static CompilerRepresentation select(@Nullable List<CompilerRepresentation> compilerRepresentations,
                                         @Nullable CompilerRepresentation userSelected, String[] flags) {
        if (compilerRepresentations != null) {
            for (CompilerRepresentation compilerRepresentation : compilerRepresentations) {
                for (String flag : flags) {
                    if (compilerRepresentation.getFlags().contains(flag)) {
                        return compilerRepresentation;
                    }
                }
            }
        }
        return userSelected;
    }

    private static String redirectFlag(String arg, String name, String fileExtension) {
        String res = arg + " ";
        res += name.substring(0, name.lastIndexOf("."))+fileExtension;
        return res;
    }

    @Nullable
    public static Representation compile(CompilerRepresentation compilerRepresentation, Code code, List<String> userFlags) throws IOException {
        boolean redir = false;
        String path = code.getPath();
        File dir = new File(path);
        List<String> innerFlags = new ArrayList<>();
        if (compilerRepresentation.getFlags() != null
                && !compilerRepresentation.getFlags().isEmpty()) {
            innerFlags = new ArrayList<>();
            innerFlags.addAll(compilerRepresentation.getFlags());
            if (innerFlags.contains("-o")) {
                innerFlags.remove("-o");
                innerFlags.add(redirectFlag("-o", code.getName(),
                        compilerRepresentation.getLllanguage().getType().getExtension()));
            }
            if (innerFlags.contains(">")) {
                innerFlags.remove(">");
                redir = true;
            }
        }
        List<String> outerFlags = new ArrayList<>();
        if (!userFlags.isEmpty()) {
            outerFlags.addAll(userFlags);
        }

        List<String> flags = combineFlags(innerFlags, outerFlags);
        List<String> args = new ArrayList<>();
        args.add(compilerRepresentation.getCompiler().getPath());
        args.addAll(flags);
        args.add(code.getName());

        ProcessBuilder processBuilder = new ProcessBuilder(args);
        if (!path.isEmpty()) {
            processBuilder.directory(dir);
        }
        if (redir) {
            File file = new File( path + File.separator +
                    code.getName().substring(0, code.getName().lastIndexOf("."))
                            + compilerRepresentation.getLllanguage().getType().getExtension());
            if (!file.exists()) {
                file.createNewFile();
            }
            processBuilder.redirectOutput(file);
        }
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
                            + compilerRepresentation.getLllanguage().getType().getExtension()
            );
            result.setCompiler(compilerRepresentation.getCompiler());
            result.setPath(path);
            result.setLanguage(compilerRepresentation.getLllanguage());
            result.setFlags(flags);
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

    private static List<String> combineFlags(List<String> innerFlags, List<String> outerFlags) {
        List<String> flags = new ArrayList<>(innerFlags);
        for (String flag : outerFlags) {
            if (!flags.contains(flag)) {
                flags.add(flag);
            }
        }
        return flags;
    }
}
