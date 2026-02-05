package com.example.jutjubic.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@Service
public class ThumbnailCacheServiceImpl implements ThumbnailCacheService {
    private static final Logger log = LoggerFactory.getLogger(PostService.class);

    @Override
    @Cacheable(value = "thumbnails", key = "#filename")
    public byte[] findThumbnail(String filename) throws IOException {
        log.info("Loading thumbnail from disk: {}", filename);
        return Files.readAllBytes(Paths.get(filename).toAbsolutePath());
    }
}
