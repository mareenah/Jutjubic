package com.example.jutjubic.service;

import java.io.IOException;

public interface ThumbnailCacheService {
    byte[] findThumbnail(String path) throws IOException;

}
