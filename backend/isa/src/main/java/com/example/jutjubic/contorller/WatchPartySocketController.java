package com.example.jutjubic.contorller;

import com.example.jutjubic.dto.WatchPartyEventDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class WatchPartySocketController {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;


    @MessageMapping("/watch-party/start")
    public void startVideo(WatchPartyEventDto event) {
        simpMessagingTemplate.convertAndSend(
                "/socket-publisher/watch-party/" + event.getPartyId(),
                event
        );
    }
}
