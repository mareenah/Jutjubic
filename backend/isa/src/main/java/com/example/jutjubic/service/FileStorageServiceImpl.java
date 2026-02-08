package com.example.jutjubic.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.*;

@Service
public class FileStorageServiceImpl implements FileStorageService{

    @Value("${file.upload.tmp-dir}")
    private String tmp;

    public Path saveToTemp(MultipartFile file, String filename) {
        try {
            Path tmpDirectory = Paths.get(tmp).toAbsolutePath();
            Files.createDirectories(tmpDirectory);

            Path tempFilePath = tmpDirectory.resolve(filename);

            boolean isVideo = file.getContentType() != null && file.getContentType().equals("video/mp4");

            if(isVideo) {
                long startTime = System.currentTimeMillis();
                long sizeMb = file.getSize() / (1024 * 1024);
                long timeoutMs = Math.max(30_000, sizeMb * 1000L); //min 30s, max ~3min

                try (InputStream in = file.getInputStream(); OutputStream out = Files.newOutputStream(
                        tempFilePath, StandardOpenOption.CREATE_NEW)) {
                    byte[] buffer = new byte[8192];
                    int bytesRead;

                    while ((bytesRead = in.read(buffer)) != -1) {
                        out.write(buffer, 0, bytesRead);

                        if (System.currentTimeMillis() - startTime > timeoutMs) {
                            throw new ResponseStatusException(HttpStatus.REQUEST_TIMEOUT, "File upload took too long");
                        }
                    }
                }
            } else {
                Files.copy(file.getInputStream(), tempFilePath, StandardCopyOption.REPLACE_EXISTING);
            }

            return tempFilePath;

        }catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to save file to temporary storage");
        }
    }

    public void moveToFinal(Path tmpFile, Path finalDir) throws IOException {
        Files.createDirectories(finalDir);
        Files.move(tmpFile, finalDir.resolve(tmpFile.getFileName()),
                StandardCopyOption.REPLACE_EXISTING);
    }

    public void deleteTemp(Path tmpFile) {
        try {
            Files.deleteIfExists(tmpFile);
        } catch (IOException ignored) {}
    }
}
