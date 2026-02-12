package com.example.jutjubic.contorller;

import com.example.jutjubic.dto.WatchPartyEventDto;
import com.example.jutjubic.model.WatchParty;
import com.example.jutjubic.service.WatchPartyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;

import java.nio.file.AccessDeniedException;
import java.util.UUID;

@Controller
public class WatchPartySocketController {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private WatchPartyService watchPartyService;

    @MessageMapping("/watch-party/start")
    public void startVideo(WatchPartyEventDto event) throws AccessDeniedException {
        WatchParty party = watchPartyService.findWatchPartyById(event.getPartyId());

        simpMessagingTemplate.convertAndSend(
                "/socket-publisher/watch-party/" + event.getPartyId(),
                event
        );

        watchPartyService.delete(party);
    }
}
