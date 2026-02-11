package com.example.jutjubic.contorller;

import com.example.jutjubic.dto.PostDto;
import com.example.jutjubic.dto.WatchPartyDto;
import com.example.jutjubic.model.Post;
import com.example.jutjubic.model.User;
import com.example.jutjubic.model.WatchParty;
import com.example.jutjubic.service.PostService;
import com.example.jutjubic.service.WatchPartyService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/watch-party")
public class WatchPartyController {

    @Autowired
    private WatchPartyService watchPartyService;

    @PostMapping(value = "/create", consumes = "application/json")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Object> create(@Valid @RequestBody WatchPartyDto watchPartyDto) {
        return ResponseEntity.ok(watchPartyService.create(watchPartyDto));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Object> findWatchParty(@PathVariable UUID id) {
        return ResponseEntity.ok(watchPartyService.findWatchPartyById(id));
    }

    @GetMapping("/creator/{creatorId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<WatchParty>> findWatchPartiesByCreator(@PathVariable UUID creatorId) {
        List<WatchParty> watchParties = watchPartyService.findWatchPartiesByCreator(creatorId);
        return ResponseEntity.ok(watchParties);
    }

    @GetMapping("/if-creator/{creatorId}")
    @PreAuthorize("isAuthenticated()")
    public boolean isCreator(@PathVariable UUID creatorId) {
        return watchPartyService.findCreatorById(creatorId);
    }

    @GetMapping("/if-member/{userId}")
    @PreAuthorize("isAuthenticated()")
    public boolean isMember(@PathVariable UUID userId) {
        return watchPartyService.findMemberById(userId);
    }

    @GetMapping("/member/{memberId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<WatchParty>> findWatchPartiesByMember(@PathVariable UUID memberId) {
        return ResponseEntity.ok(watchPartyService.findWatchPartiesByMember(memberId));
    }

    @GetMapping("/{id}/creator")
    public ResponseEntity<User> getCreator(@PathVariable UUID id) {
        return ResponseEntity.ok(watchPartyService.getCreatorByWatchPartyId(id));
    }
}
