package com.example.jutjubic.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;

public interface FileStorageService {
    Path saveToTemp(MultipartFile file, String filename) throws IOException;
    void moveToFinal(Path tmpFile, Path finalDir) throws IOException;
    void deleteTemp(Path tmpFile);
}
